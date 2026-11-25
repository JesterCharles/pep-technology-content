"""Record functions for the workshop sign-up desk.

Each TODO names its task in README.md. A sign-up is a dict such as
{"email": "ana.ruiz@example.com", "name": "Ana Ruiz", "session": "general"}.
"""

# TODO Task 8: import the standard-library logging module and create this module's logger here.


# --- Task 1: port the Java desk methods -------------------------------------


def session_status(capacity, taken):
    """Return "full", "almost full" or "open" (see the Java version in README.md, Task 1)."""
    # TODO Task 1: port the Java if / else if / else chain.
    raise NotImplementedError("Task 1: port sessionStatus from the README")


def tables_needed(people, table_size):
    """Return how many tables seat `people` guests, filling one table at a time."""
    # TODO Task 1: port the Java while loop.
    raise NotImplementedError("Task 1: port tablesNeeded from the README")


# --- Task 2: look up one sign-up ---------------------------------------------


def find_signup(signups, email):
    """Return the sign-up whose email equals `email`, or None when there is none."""
    # TODO Task 2: loop with for, compare with ==, return None when nothing matches.
    raise NotImplementedError("Task 2: write find_signup")


def describe(signups, email):
    """Return "<email> is in <session>" or "<email> is not signed up"."""
    # TODO Task 2: call find_signup and test its result with `is None`.
    raise NotImplementedError("Task 2: write describe")


# --- Task 3: clean one raw row -----------------------------------------------


def normalize_signup(row, default_session):
    """Return a cleaned copy of `row`.

    email: surrounding spaces removed, lower case.
    name: surrounding spaces removed, each word capitalised ("ana ruiz" -> "Ana Ruiz").
    session: the row's session, or `default_session` when the row's session is empty.
    """
    # TODO Task 3: give default_session the default "general", add type hints, write the body.
    raise NotImplementedError("Task 3: write normalize_signup")


# --- Task 4: one flexible report line ----------------------------------------


def report_line(title, values, fields):
    """Return "title: v1, v2 (key=value, key=value)".

    report_line("data", "1 signed up", "3 seats left", status="open")
    -> "data: 1 signed up, 3 seats left (status=open)"
    With no keyword fields there is no bracket part: "data: 1 signed up".
    """
    # TODO Task 4: accept any number of values with *values and any keyword fields with **fields.
    raise NotImplementedError("Task 4: write report_line")


# --- Task 5: counts and lookups ----------------------------------------------


def count_by_session(signups):
    """Return {session: number of sign-ups} for the sessions that appear in `signups`."""
    counts = {}
    for signup in signups:
        counts[signup["session"]] += 1  # TODO Task 5: this raises KeyError for a new session.
    return counts


def open_sessions(capacity, counts):
    """Return the sessions, in `capacity` order, that still have at least one free seat.

    A session missing from `counts` has no sign-ups yet.
    """
    # TODO Task 5: loop over capacity.items(), unpacking each pair into two names.
    raise NotImplementedError("Task 5: write open_sessions")


def cancel(emails, email):
    """Remove `email` from the list `emails` and return True; return False when it is not there."""
    # TODO Task 5
    raise NotImplementedError("Task 5: write cancel")


# --- Task 6: comprehensions --------------------------------------------------


def emails_for(signups, session):
    """Return the emails of the sign-ups for `session`, in order."""
    # TODO Task 6: rewrite this loop as one list comprehension.
    result = []
    for signup in signups:
        if signup["session"] == session:
            result.append(signup["email"])
    return result


def unique_emails(signups):
    """Return the set of distinct emails."""
    # TODO Task 6: one set comprehension.
    raise NotImplementedError("Task 6: write unique_emails")


def seats_left_by_session(capacity, counts):
    """Return {session: free seats} for every session in `capacity`."""
    # TODO Task 6: one dict comprehension.
    raise NotImplementedError("Task 6: write seats_left_by_session")


# --- Task 7: aliasing bugs reported by the desk ------------------------------


def add_to_waitlist(email, waitlist=[]):
    """Append `email` to `waitlist` (a new list when none is given) and return the list."""
    waitlist.append(email)
    return waitlist


def mark_checked_in(signup):
    """Return a copy of `signup` with "checked_in": True; the original must not change."""
    signup["checked_in"] = True
    return signup


# --- Task 8: a clear error for a bad seats value -----------------------------

# TODO Task 8: define SignupError here.


def parse_seats(text):
    """Return the whole number of seats in `text`, the seats value a sign-up form sends (at least 1)."""
    try:
        return int(text)
    except:
        print("bad seats value")
        return 0
