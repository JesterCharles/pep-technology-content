# Designing tables from a user story

## Objectives

- Extract the entities, attributes and relationships a user story names
- Turn them into a table design with a primary key for every table and a foreign key for every one-to-many relationship
- Check a table design against the story's acceptance criteria and find a missing table, column or key

## Teaching

### Start with a guess

A club organiser wrote the user story on the right. Before any teaching, guess how many tables it needs.

### Read the story for nouns and verbs

- An entity is a kind of thing the story keeps many of, like members. Each becomes a table.
- An attribute is a fact about one entity, like a member's email. Each becomes a column.
- A relationship is a verb that links entities, like "signs up for". It becomes a key.

The acceptance criteria list what must be stored. Who uses the system is not data unless a criterion asks for it.

### From parts to tables

1. Each entity becomes a table with a primary key, usually `id`.
2. Each one-to-many relationship gets a foreign key on the many side.
3. A many-to-many relationship becomes a junction table. It turns into two one-to-many relationships, so it holds two foreign keys.
4. A fact about the link itself, such as when a member signed up, goes in the junction table.

### Check against the criteria

Read each acceptance criterion and point to the table and column that store it. If you cannot point to one, something is missing: a column, a table, or a key.

Also check the rule from step 3: every table needs a primary key, including a junction table. Its key can be the pair of foreign keys.

### Apply it

A new story and one new criterion.

## Model

The user story and the design it grows into

Story: As a club organiser, I want members to sign up for events, so that I know who is coming to each event.

Acceptance criteria:

1. Each member has a name and an email address.
2. Each event has a title, a date and a room.
3. A member can sign up for many events, and an event can have many members.
4. The organiser can see when each sign-up was made.

Design so far:

Nothing yet. It fills in as you finish each activity.

## Recap

- Entities become tables, attributes become columns, relationships become keys.
- Every table gets a primary key; every one-to-many relationship gets a foreign key on the many side; many-to-many gets a junction table.
- Check each acceptance criterion against the design and name what is missing: a column, a table or a key.

Next topic: Normalization basics

## Cheat sheet

|  |  |
| --- | --- |
| Noun the story keeps many of | table, with a primary key |
| Fact about one thing | column in that thing's table |
| One X has many Y | foreign key in Y, pointing at X |
| Many X and many Y | junction table with two foreign keys |
| Fact about the link | column in the junction table |

The design for this story: `members (id, name, email)`, `events (id, title, event_date, room)`, `signups (member_id, event_id, signed_up_at)` with primary key `(member_id, event_id)`. The next pages write it as SQL.

## Sources

Checked against these live PostgreSQL 18 pages on 2026-10-14. The user story format and the words entity and attribute are common design vocabulary, not PostgreSQL documentation terms; they are listed as unverified in this topic's review record.

- PostgreSQL 18: 5.1 Table Basics
- PostgreSQL 18: 5.5 Constraints (primary and foreign keys, many-to-many example)
- PostgreSQL 18 tutorial: 2.3 Creating a New Table

## Static interaction alternatives

### predict

Prediction (practice, not scored): how many tables does the club story need? Options: one table; two tables, members and events; three tables, members, events and signups; four tables, adding organisers. Answer: three. Members and events are the two kinds of thing, and because a member signs up for many events and an event has many members, the sign-ups need their own junction table. No criterion asks to store organisers.

### explore

Tagging activity with answers. member: entity (a table). event: entity. email address: attribute of member (a column). date: attribute of event. signs up for: relationship between member and event. when each sign-up was made: attribute of the sign-up itself, so it belongs to the link between a member and an event.

### explore

Design activity with answers. Primary key of members: id. Primary key of events: id. Member signs up for event is many-to-many, so it becomes a junction table signups. signups.member_id is a foreign key to members.id; signups.event_id is a foreign key to events.id. The sign-up time, signed_up_at, is a column of signups.

### explore

Checking activity with answers, for the draft members (id PK, name), events (id PK, title, event_date), signups (member_id FK, event_id FK). Criterion 1, name and email: missing a column, email. Criterion 2, title, date and room: missing a column, room. Criterion 3, many events per member and many members per event: met by the junction table signups. Criterion 4, when each sign-up was made: missing a column, signed_up_at in signups. Rule, every table has a primary key: missing a key, signups has none; use PRIMARY KEY (member_id, event_id) or an id column.

### mcq

Apply question: assignments must each belong to one course with a name. Options: a courses table (id, name) plus assignments.course_id as a foreign key (answer); a course_name column in grades (repeats the name on every grade and does not tie an assignment to one course); a junction table students_courses (answers a different question, which students take which course); nothing is missing (no table stores a course name). Second try: one course has many assignments, so the foreign key goes in assignments, as assignments.course_id.
