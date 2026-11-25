"""Summary script for one workshop session.

Run it from the starter folder:  python -m signups.cli SESSION
"""

from signups.sample import CAPACITY, SIGNUPS

# TODO Task 9: import the standard-library sys module, and the record functions you use from signups.records.


def main(argv):
    """Print the one-line summary for the session in argv[1]; return the exit status."""
    # TODO Task 9: usage message and status 2 when the session argument is missing,
    # "unknown session: <name>" and status 1 for a session not in CAPACITY,
    # otherwise print the summary line and return 0.
    raise NotImplementedError("Task 9: write main")


# TODO Task 9: only run main when this file is run as a script, and exit with its status.
main(sys.argv)
