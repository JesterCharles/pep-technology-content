# Reading: Installing Postgres and a SQL client

## Objectives

- Identify the parts of a PostgreSQL setup: the database server, a database inside it, and a client such as psql that connects to it
- Connect to a local database with psql and confirm the server version with SELECT version();
- Use the psql meta-commands \\l, \\dt, \\d and \\q to list databases, list tables, describe a table and quit

## Teaching

### Start with a guess

You installed PostgreSQL and opened a terminal. Before any teaching, guess where your SQL goes.

### Server, database, client

- The server is a program that keeps running in the background. One server manages many databases and listens for connections, usually on port 5432.
- A database is a named set of tables inside that server, often one per project.
- A client connects to one database. `psql` is PostgreSQL's terminal client: `psql practice` connects to the database named `practice`.

The prompt `practice=>` means psql is ready. A statement runs when you end it with a semicolon; without one, psql waits for more and shows `practice->`.

### Backslash commands

Commands that start with a backslash belong to psql itself, not to SQL, and need no semicolon.

- `\l` lists the databases in the server.
- `\dt` lists the tables in the database you are connected to.
- `\d courses` describes one table: its columns, types and keys.
- `\q` quits psql and returns you to the shell.

### Apply it

Pick the command for a new situation.

## Model

One PostgreSQL server, its databases, and the psql client. Fictional machine; the terminal is a simulation.

psql, the server and its databases On the left, the psql client. An arrow labelled localhost port 5432 goes to the PostgreSQL server on the right. Inside the server are four databases: postgres, practice, template0 and template1. The practice database holds one table, courses. psql client localhost port 5432 PostgreSQL server postgres practice table: courses template0 template1

Connection: none. A dashed arrow means psql is not connected.

## Recap

- The server runs in the background and manages many databases; psql is a client that connects to one of them.
- `psql practice` connects; `SELECT version();` asks the server which version it runs. SQL runs at the semicolon.
- `\l` databases, `\dt` tables, `\d name` one table, `\q` quit.

Next topic: Tables, keys and relationships

## Cheat sheet

|  |  |
| --- | --- |
| `psql --version` | version of the psql client program |
| `psql practice` or `psql -d practice` | connect to the database practice |
| `psql -h localhost -p 5432 -U ana -d practice` | connect with host, port and user named |
| `SELECT version();` | version of the server you are connected to |
| `\l` / `\dt` / `\d name` / `\q` | databases / tables / describe one table / quit |

Installing: the PostgreSQL download page lists packages and installers for Linux, macOS, Windows and other systems. Follow the one for your system, then check that `psql --version` works in a new terminal. Without a database name, psql tries a database named after your user name.

## Sources

Checked against these live PostgreSQL pages on 2026-10-13 (documentation for PostgreSQL 18).

- PostgreSQL: Downloads
- PostgreSQL 18 tutorial: 1.1 Installation
- PostgreSQL 18 tutorial: 1.3 Creating a Database
- PostgreSQL 18 tutorial: 1.4 Accessing a Database
- PostgreSQL 18 reference: psql

The practice terminal is a simulation. Its version text copies the PostgreSQL tutorial's example; yours names your own version and platform. The `\l` locale columns depend on how your server was set up.

## Static interaction alternatives

### predict

Prediction (practice, not scored): where do you type SQL? Options: into psql, a client program that connects to the server; into the PostgreSQL server program directly; into the database's files on disk; into the PostgreSQL download page. Answer: psql. The server runs in the background and only answers connections from clients; the database is data the server manages; the download page only provides installers.

### terminal

Terminal activity: connect and check the version. In the shell, psql practice (or psql -d practice) connects and prints: psql (18.6), Type "help" for help. The prompt becomes practice=>. Then SELECT version(); prints one row, for example PostgreSQL 18.6 on x86_64-pc-linux-gnu, compiled by gcc, 64-bit, followed by (1 row). Typing psql with no name tries a database named after your user and fails here with: database "ana" does not exist. Leaving out the semicolon makes psql wait with the prompt practice->; typing ; finishes the statement.

### terminal

Terminal activity, connected to practice. \l prints List of databases: postgres, practice (owner ana), template0, template1. \dt prints List of tables with one row: public | courses | table | ana. \d courses prints Table "public.courses" with columns id integer not null, title text not null, credits integer not null, and the index courses_pkey PRIMARY KEY, btree (id). \q quits psql and returns to the shell prompt.

### mcq

Apply question: connected to shop, Mo needs the columns of orders and which may be empty. Options: \l (lists databases, not columns); \dt (lists tables, not their columns); \d orders (correct: describes the table, with each column's type and a Nullable column); SELECT version(); (reports the server version). Second try, other way round: a List of tables output was printed by \dt.
