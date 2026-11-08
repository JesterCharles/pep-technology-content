# Monolith vs microservices: a database per service and the trade-offs

## Objectives

- Compare a monolith and microservices on deployment, scaling and failure isolation for a described system
- Explain the database-per-service pattern and why one service must not read another service's tables directly
- Name a cost that microservices add for a given design, such as network failures, consistency across services or operational overhead

## Teaching

The shop runs as one Spring Boot application. It handles checkout and it also generates reports.

A memory bug in the report code uses up the heap, and the JVM process exits.

A monolith is one deployable unit: all modules are built, released and scaled together, and they call each other in the same process.

Microservices split the system into services that run as separate processes and can each be deployed on their own. They talk over the network.

Compare them on three questions: what must be deployed for a change, what can be scaled alone, and what fails together.

One process versus two servicesLeft: one box holds checkout and reports. Right: two separate boxes, api and reports, joined by a network call. one process checkout reports api reports

Left: a monolith. Right: two services joined by a network call.

In the database-per-service pattern, each service keeps its data private. Other services reach that data only through the owner's API.

Why so strict? If `api` reads the tables of `reports` directly, those tables have become a public contract. Renaming a column now breaks another team's code, and every schema change has to be coordinated.

The privacy can be separate tables, a separate schema or a separate database server. What matters is that no other service reads them.

Microservices add costs a monolith does not have:

- Network failures: a call that was in-process can now time out.
- Consistency across services: one database transaction cannot cover two private databases, so data may agree only eventually.
- Operational overhead: more images, deployments and logs to run and trace.

A design review weighs those costs against what the system needs.

## Recap

You finished 0 of 4 activities and got 0 right. Any settled activity shows what to review; Restart activity lets you try it again.

- A monolith deploys, scales and fails as one unit; microservices can do each per service.
- Database per service: data stays private and is reached only through the owner’s API.
- Microservices add network failures, consistency work across services and operational overhead.

## Cheat sheet

Reading without JavaScript: decide first, then read on.

One restaurant kitchen serves every dish. If the fryer catches fire, the whole restaurant closes. A food court has separate stalls, so one closure leaves the others open, but customers now walk between stalls and each stall runs its own till.

Separate stalls contain a failure, and they add walking and coordination.

Where to act: Open the Shape control first.

Next step: Ask which shape gives report code a process of its own.

Printed alternative: Monolith: a change redeploys everything, scaling copies everything, and a crash stops everything. Two services: a change redeploys one service, scaling copies one service, and a crash stops one service if callers handle the failed call; the cost is network calls that can fail.

Where to act: Start with the row that mentions SQL.

Next step: For each row, ask who reads the data and whether they own it.

Reading without JavaScript: decide first, then read on.

Reading without JavaScript: decide first, then read on.

Optional time: about 3 minutes

Success criteria: For a system you know, name one part that would gain from being its own service, the deployment, scaling or failure reason why, and one new cost that split adds.

- Failure isolation needs callers that handle a failed call.
- Reading another service’s tables turns its schema into a public contract.
- Next: add the FastAPI `reports` service and its own database to Compose.

## Sources

Status: minimum release, checked by the page author on 2026-11-08. Sources were fetched live on 2026-11-04 and the author checked the page against them; no independent education or technology review was performed.

- Microservices architecture style: independent deployment, fault isolation, challenges
- Data considerations for microservices: two services should not share a data store, eventual consistency
- Pattern: Database per service: data private to a service and reached through its API
- Microservices (Lewis and Fowler): decentralized data management

## Static interaction alternatives

### predict

What happens to checkout? Each option is explained after the question in this reading.

### explore

Monolith: a change redeploys everything, scaling copies everything, and a crash stops everything. Two services: a change redeploys one service, scaling copies one service, and a crash stops one service if callers handle the failed call; the cost is network calls that can fail.

### drag

Does this design fit database per service? Each row and its explanation follow in this reading.

### mcq

Three developers ship the shop together once a week, and load is even across modules. A proposal splits it into nine services. Which comment fits? Each option is explained after the question in this reading.
