# Reading: Installing Postgres and a SQL client

## Objectives

- Identify the parts of a PostgreSQL setup: the database server, a database inside it, and a client such as psql that connects to it
- Connect to a local database with psql and confirm the server version with SELECT version();
- Use the psql meta-commands \\l, \\dt, \\d and \\q to list databases, list tables, describe a table and quit

## Teaching

### Start with a guess

First you practise in a simulated terminal; at the end you install a real server. Before any teaching, guess where your SQL goes.

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

### Now on your own computer

The terminal above was a simulation. Install a real server: open the steps for your system.

macOS: Postgres.app

1. Where: postgresapp.com, linked from the PostgreSQL download page for macOS.
2. What: move Postgres.app into Applications, open it and select Initialize. Then put its tools on your path:
   ```
   sudo mkdir -p /etc/paths.d && echo /Applications/Postgres.app/Contents/Versions/latest/bin | sudo tee /etc/paths.d/postgresapp
   ```
3. Expect: the app shows a running server on port 5432. Your PostgreSQL user is your macOS user name, with no password. If macOS asks whether Terminal may connect, allow it.
4. Done: in a new terminal, the checks below pass.

Windows: the installer

1. Where: the Windows installer linked from the PostgreSQL download page for Windows.
2. What: run it with the default components and port 5432. Choose a password for the superuser `postgres` and keep it. Then add `C:\Program Files\PostgreSQL\18\bin` to your Path environment variable.
3. Expect: the server runs as a Windows service that starts with Windows.
4. Done: in a new terminal, the checks below pass with `-U postgres` added and that password.

Linux: Ubuntu or Debian

1. Where: a terminal. Other distributions: see the PostgreSQL download page for Linux.
2. What: install the server, then create a PostgreSQL user with your name that may create databases:
   ```
   sudo apt install postgresql
   sudo -u postgres createuser --createdb --pwprompt "$USER"
   ```
3. Expect: the server starts after installing; `createuser` asks for your new password twice.
4. Done: the checks below pass with that password.

Check client, server and connection.

1. Where: a new terminal.
2. What: run these three commands:
   ```
   psql --version
   pg_isready -h localhost -p 5432
   psql -h localhost -d postgres -c "SELECT version();"
   ```
3. Expect: `psql (PostgreSQL) 18.x` proves only the client exists. `accepting connections` proves the server runs. The last command prints one row starting `PostgreSQL 18`.
4. Done: that version row is your first real connection.

If a check fails:

- Server not running: `Connection refused`, or `no response`. Start it: open Postgres.app and select Start; on Windows, start the `postgresql` service in Services; on Linux, run `sudo systemctl start postgresql`.
- Wrong user or database: `role "ana" does not exist` or `database "ana" does not exist`. Name ones that exist, such as `-U postgres -d postgres`.
- Authentication: `password authentication failed`. Retype the password you chose and check the user name. On Linux, `Peer authentication failed` means `-h localhost` is missing.

Next topic: Tables, keys and relationships

## Cheat sheet

|  |  |
| --- | --- |
| `psql --version` | version of the psql client program |
| `psql practice` or `psql -d practice` | connect to the database practice |
| `psql -h localhost -p 5432 -U ana -d practice` | connect with host, port and user named |
| `SELECT version();` | version of the server you are connected to |
| `\l` / `\dt` / `\d name` / `\q` | databases / tables / describe one table / quit |

Without a database name, psql tries a database named after your user name.

## Sources

Checked against these live PostgreSQL pages on 2026-10-14 (documentation for PostgreSQL 18).

- PostgreSQL: Downloads
- PostgreSQL: macOS packages (Postgres.app)
- PostgreSQL: Windows installers
- PostgreSQL: Linux downloads (Ubuntu)
- PostgreSQL 18 tutorial: 1.1 Installation
- PostgreSQL 18 tutorial: 1.3 Creating a Database
- PostgreSQL 18 tutorial: 1.4 Accessing a Database
- PostgreSQL 18 reference: psql
- PostgreSQL 18 reference: pg_isready
- PostgreSQL 18: 18.3 Starting the Database Server
- PostgreSQL 18: Authentication Problems

The installer steps (button names, paths, the service and the first-connection prompt) describe the current installers and packages, which can change; their download pages are the reference. The practice terminal is a simulation. Its version text copies the PostgreSQL tutorial's example; yours names your own version and platform. The `\l` locale columns depend on how your server was set up.

## Static interaction alternatives

### predict

Prediction (practice, not scored): where do you type SQL? Options: into psql, a client program that connects to the server; into the PostgreSQL server program directly; into the database's files on disk; into the PostgreSQL download page. Answer: psql. The server runs in the background and only answers connections from clients; the database is data the server manages; the download page only provides installers.

### terminal

Terminal activity: connect and check the version. In the shell, psql practice (or psql -d practice) connects and prints: psql (18.6), Type "help" for help. The prompt becomes practice=>. Then SELECT version(); prints one row, for example PostgreSQL 18.6 on x86_64-pc-linux-gnu, compiled by gcc, 64-bit, followed by (1 row). Typing psql with no name tries a database named after your user and fails here with: database "ana" does not exist. Leaving out the semicolon makes psql wait with the prompt practice->; typing ; finishes the statement.

### terminal

Terminal activity, connected to practice. \l prints List of databases: postgres, practice (owner ana), template0, template1. \dt prints List of tables with one row: public | courses | table | ana. \d courses prints Table "public.courses" with columns id integer not null, title text not null, credits integer not null, and the index courses_pkey PRIMARY KEY, btree (id). \q quits psql and returns to the shell prompt.

### mcq

Apply question: connected to shop, Mo needs the columns of orders and which may be empty. Options: \l (lists databases, not columns); \dt (lists tables, not their columns); \d orders (correct: describes the table, with each column's type and a Nullable column); SELECT version(); (reports the server version). Second try, other way round: a List of tables output was printed by \dt.
