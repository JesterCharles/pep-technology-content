"""Regression checks for the lab's own setup and cleanup scripts (not part of the learner checks).

Run from the lab folder:  python tests/check_lab_scripts.py
Each check copies the lab into a temporary folder and works only on that copy, so it never
touches a learner's repository. The learner test command does not discover this file.
"""

import os
import shutil
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

LAB_ROOT = Path(__file__).resolve().parent.parent


class LabScripts(unittest.TestCase):
    def setUp(self):
        self.temp = Path(tempfile.mkdtemp(prefix="ship-safe-change-"))
        self.lab = self.temp / "lab"
        shutil.copytree(
            LAB_ROOT,
            self.lab,
            ignore=shutil.ignore_patterns("__pycache__", ".git", ".env"),
        )
        self.repo = self.lab / "starter" / "ship-safe-change"
        # A personal global config whose excludes file ignores .env, isolated from the host's own.
        excludes = self.temp / "global-excludes"
        excludes.write_text(".env\n", encoding="utf-8")
        config = self.temp / "global-config"
        config.write_text(
            f"[core]\n\texcludesFile = {excludes.as_posix()}\n", encoding="utf-8"
        )
        self.env = dict(
            os.environ,
            GIT_CONFIG_GLOBAL=str(config),
            GIT_CONFIG_NOSYSTEM="1",
            GIT_CEILING_DIRECTORIES=str((self.lab / "starter").resolve()),
            LC_ALL="C",
            PYTHONDONTWRITEBYTECODE="1",
        )

    def tearDown(self):
        subprocess.run([sys.executable, "tests/cleanup_lab.py"], cwd=self.lab, env=self.env)
        shutil.rmtree(self.temp, ignore_errors=True)

    def run_script(self, name):
        result = subprocess.run(
            [sys.executable, f"tests/{name}"],
            cwd=self.lab,
            env=self.env,
            capture_output=True,
            text=True,
        )
        self.assertEqual(result.returncode, 0, result.stderr)

    def git(self, *args):
        return subprocess.run(
            ["git", "-C", str(self.repo), *args],
            env=self.env,
            capture_output=True,
            text=True,
        )

    def expected_starter(self):
        """Shipped starter bytes, built from fixtures/ rather than the (possibly edited) copy."""
        fixtures = self.lab / "fixtures"
        files = {
            path.name: path.read_bytes().replace(b"\r\n", b"\n")
            for path in (fixtures / "initial").iterdir()
        }
        files["status_message.py"] = (
            (fixtures / "proposal" / "status_message.py").read_bytes().replace(b"\r\n", b"\n")
        )
        return dict(sorted(files.items()))

    def shipped_files(self):
        return {
            path.relative_to(self.repo).as_posix(): path.read_bytes()
            for path in sorted(self.repo.rglob("*"))
            if path.is_file()
        }

    def test_global_env_ignore_does_not_hide_starting_state(self):
        self.run_script("setup_lab.py")
        self.assertNotEqual(
            self.git("check-ignore", "--quiet", ".env").returncode,
            0,
            "a global excludes rule still hides .env",
        )
        status = self.git("status", "--porcelain").stdout.splitlines()
        self.assertIn("?? .env", status)
        self.assertIn(" M status_message.py", status)

    def test_reset_and_cleanup_remove_learner_added_files(self):
        self.run_script("setup_lab.py")
        extra = self.repo / "notes" / "learner-notes.txt"
        extra.parent.mkdir()
        extra.write_text("private learner note\n", encoding="utf-8")

        self.run_script("setup_lab.py")
        self.assertFalse(extra.exists(), "reset kept a learner-added file")
        self.assertFalse(extra.parent.exists(), "reset kept a learner-added folder")
        tracked = self.git("log", "--all", "--name-only", "--format=").stdout.split()
        self.assertNotIn("notes/learner-notes.txt", tracked)

        extra.parent.mkdir()
        extra.write_text("private learner note\n", encoding="utf-8")
        self.run_script("cleanup_lab.py")
        self.assertFalse(extra.parent.exists(), "cleanup kept a learner-added folder")
        self.assertEqual(
            self.shipped_files(), self.expected_starter(), "cleanup did not restore shipped bytes"
        )


if __name__ == "__main__":
    unittest.main()
