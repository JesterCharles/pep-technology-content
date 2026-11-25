"""PostgreSQL steps of the pipeline (Tasks 2, 3 and 4).

connect() opens a connection from DATABASE_URL. load_staging and run_transform open their own
connection with a `with` block, as the loading and ELT pages do. The tables are in schema.sql.
"""

import os

import psycopg


# --- Task 2: connect and query safely ----------------------------------------


def connect():
    """Open a connection from the DATABASE_URL environment variable."""
    # TODO Task 2
    raise NotImplementedError("Task 2: write connect")


def signups_for_session(conn, session):
    """Return [(email, seats), ...] from staging_signups for `session`, ordered by email."""
    # TODO Task 2: a parameterized query; never put `session` into the SQL text yourself.
    raise NotImplementedError("Task 2: write signups_for_session")


# --- Task 3: load into the staging table with an upsert ----------------------

UPSERT_SQL = """
TODO Task 3
"""


def load_staging(records):
    """Upsert every record (a dict with email, name, session, seats, signed_up_at) in one batch."""
    # TODO Task 3: open the connection with `with connect() as conn:` so a clean exit commits.
    raise NotImplementedError("Task 3: write load_staging")


# --- Task 4: transform in SQL after loading ----------------------------------

TRANSFORM_SQL = """
TODO Task 4
"""


def run_transform():
    """Rebuild session_summary from staging_signups: all or nothing."""
    # TODO Task 4: in autocommit mode each statement commits by itself, so a failing INSERT
    # leaves the summary empty. Run both statements in one `with connect() as conn:` block.
    conn = connect()
    conn.autocommit = True
    conn.execute("DELETE FROM session_summary")
    conn.execute(TRANSFORM_SQL)
    conn.close()
