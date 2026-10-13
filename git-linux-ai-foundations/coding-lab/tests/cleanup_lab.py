"""Remove everything the lab created and restore the shipped starter files.

Run from the lab folder:  python tests/cleanup_lab.py
It deletes only the paths declared in lab.json cleanup.paths, after checking each stays inside the lab.
"""

from lab_support import CREATED_PATHS, remove, restore_starter_files


def main():
    for path in CREATED_PATHS:
        remove(path)
    restore_starter_files()
    print("Lab cleaned: starter/ship-safe-change/ is back to its shipped files.")


if __name__ == "__main__":
    main()
