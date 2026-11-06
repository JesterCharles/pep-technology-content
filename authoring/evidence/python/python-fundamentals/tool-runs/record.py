"""Records real pip and pytest runs for the modules/venv and pytest pages.
Usage: python3 record.py   (needs network for pip; writes pip.json and pytest.json beside this file)
The page simulators and regressions.test.mjs compare against these receipts; rerun after a deliberate refresh."""
import json, os, subprocess, sys, tempfile, datetime, platform, re
HERE = os.path.dirname(os.path.abspath(__file__))
def run(cmd, cwd, env=None):
    p = subprocess.run(cmd, cwd=cwd, capture_output=True, text=True, env=env)
    return {"cmd": " ".join(cmd), "exit": p.returncode, "stdout": p.stdout.splitlines(), "stderr": p.stderr.splitlines()}
def shorten(lines):
    # Download/cache lines vary with the local cache; the page says "(download lines shortened)".
    return [l for l in lines if l.strip() and not re.match(r"\s*(Using cached|Downloading|━)", l)]
now = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
with tempfile.TemporaryDirectory() as d:
    shop = os.path.join(d, "shop"); os.makedirs(shop)
    open(os.path.join(shop, "requirements.txt"), "w").write("pytest==9.1.1\n")
    subprocess.run([sys.executable, "-m", "venv", ".venv"], cwd=shop, check=True)
    py = os.path.join(shop, ".venv", "bin", "python")
    pipq = [py, "-m", "pip", "--disable-pip-version-check"]
    steps = {}
    steps["install_from_single_pin"] = run(pipq + ["install", "-r", "requirements.txt"], shop)
    steps["freeze"] = run(pipq + ["freeze"], shop)
    open(os.path.join(shop, "requirements.txt"), "w").write("\n".join(steps["freeze"]["stdout"]) + "\n")
    steps["reinstall_from_frozen_file"] = run(pipq + ["install", "-r", "requirements.txt"], shop)
    steps["direct_install_when_present"] = run(pipq + ["install", "pytest==9.1.1"], shop)
    open(os.path.join(shop, "requirements.txt"), "w").write("pytest==9.1.1\n")
    steps["install_single_pin_when_present"] = run(pipq + ["install", "-r", "requirements.txt"], shop)
    empty = os.path.join(d, "empty"); os.makedirs(empty)
    subprocess.run([sys.executable, "-m", "venv", ".venv"], cwd=empty, check=True)
    epy = os.path.join(empty, ".venv", "bin", "python")
    steps["freeze_in_empty_venv"] = run([epy, "-m", "pip", "--disable-pip-version-check", "freeze"], empty)
    open(os.path.join(empty, "requirements.txt"), "w").write("")
    steps["install_from_empty_file"] = run([epy, "-m", "pip", "--disable-pip-version-check", "install", "-r", "requirements.txt"], empty)
    steps["direct_install_fresh"] = run([epy, "-m", "pip", "--disable-pip-version-check", "install", "pytest==9.1.1"], empty)
    for s in steps.values(): s["stdout"] = shorten(s["stdout"])
    pip_version = subprocess.run([py, "-m", "pip", "--version"], capture_output=True, text=True).stdout.split(" from ")[0]
    json.dump({"schemaVersion": 1, "kind": "real pip run receipt", "ranAt": now, "python": platform.python_version(), "pip": pip_version,
               "note": "Dependency versions are whatever pip resolved at ranAt; the frozen file pins them exactly.", "steps": steps},
              open(os.path.join(HERE, "pip.json"), "w"), indent=2)
    # pytest: the exact seats.py shown on the page, the terminal's demonstrated tests, and the completed editor suite.
    t = os.path.join(d, "pt"); os.makedirs(t)
    open(os.path.join(t, "seats.py"), "w").write('def seats_left(capacity, taken):\n    if taken < 0:\n        raise ValueError("taken must not be negative")\n    return capacity - taken\n')
    open(os.path.join(t, "test_seats.py"), "w").write("from seats import seats_left\n\n\ndef test_some_taken():\n    assert seats_left(10, 3) == 7\n\n\ndef test_overbooked():\n    assert seats_left(10, 12) == 0\n")
    flags = ["-p", "no:cacheprovider"]
    pt = {}
    pt["all"] = run([py, "-m", "pytest"] + flags, t)
    pt["quiet"] = run([py, "-m", "pytest", "-q"] + flags, t)
    pt["node_id_pass"] = run([py, "-m", "pytest"] + flags + ["test_seats.py::test_some_taken"], t)
    pt["node_id_fail_quiet"] = run([py, "-m", "pytest", "-q"] + flags + ["test_seats.py::test_overbooked"], t)
    for s in pt.values():
        s["stdout"] = [re.sub(r"^rootdir: .*", "rootdir: <shop>", l) for l in s["stdout"]]
    json.dump({"schemaVersion": 1, "kind": "real pytest run receipt", "ranAt": now, "python": platform.python_version(), "platform": sys.platform,
               "seats.py": open(os.path.join(t, "seats.py")).read(), "test_seats.py": open(os.path.join(t, "test_seats.py")).read(), "runs": pt},
              open(os.path.join(HERE, "pytest.json"), "w"), indent=2)
print("recorded", now)
