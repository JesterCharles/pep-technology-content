# Service-name networking: why localhost fails between containers

## Objectives

- Explain why localhost inside a container refers to that container itself, not to the host or to another service
- Write a connection URL that reaches another Compose service by its service name and container port
- Tell the published host port used from a browser on the host apart from the container port one service uses to reach another

## Teaching

### Start with a guess

Practice prediction, not scored.

### Every container has its own localhost

Each container gets its own network stack. Inside the `api` container, `localhost` means `api` itself, not your laptop and not the database container.

Compose puts every service on one network, `shop_default`, and registers each service name there. So `api` reaches the database as `db`, the service name in `compose.yaml`. Container IP addresses change; names do not.

### Two ports, two audiences

In `"127.0.0.1:15432:5432"`, 15432 is the host port: your browser and tools on the laptop use `localhost:15432`.

5432 is the container port: other services use it with the service name, `db:5432`. Service-to-service traffic never goes through the published host port.

### Apply it: a new port mapping

Ask who is calling first.

## Model

Your laptop and the shop_default network (simulated)

### Laptop (host)

- Browser, database tool
- `localhost:8080` to api
- `localhost:15432` to db

### Network shop_default

- `api`: its own localhost, listens on 8080
- `db`: its own localhost, listens on 5432

No connection tried yet.

## Recap

- Inside a container, `localhost` is that container.
- Services on one Compose network reach each other by service name and container port, such as `db:5432`.
- Your laptop uses `localhost` and the published host port, such as `localhost:15432`.

Next topic: depends_on with health checks

## Cheat sheet

|  |  |
| --- | --- |
| Who calls | Address |
| Browser or tool on the laptop | `localhost:HOST_PORT` |
| Another service in the stack | `SERVICE_NAME:CONTAINER_PORT` |
| A container calling itself | `localhost:CONTAINER_PORT` |

`SPRING_DATASOURCE_URL: jdbc:postgresql://db:5432/shop`

Optional time: about 3 minutes, in addition to the topic time

Success criteria: For a new service you write both addresses and can say which half of the port mapping each one uses.

The team adds a Redis service named `cache` to the same `compose.yaml`. Redis listens on port 6379 in its container, and the service publishes `"127.0.0.1:16379:6379"`. Write the address the `api` container uses to reach Redis, and the address a Redis tool on your laptop uses. Nothing here is checked or counted.

Your two addresses (optional) api uses: laptop tool uses:

## Sources

Checked against these live official sources on 2026-10-14. Versions shown: Docker Compose 5.6 and Docker Engine 29 on the default bridge network. Connection results are simulated; real error text depends on the client (here the PostgreSQL JDBC driver).

- Docker Docs: Networking in Compose (default network, service discovery, HOST_PORT and CONTAINER_PORT)
- Docker Docs: Networking overview (each container has its own network stack)
- Docker Docs: Port publishing and mapping

## Static interaction alternatives

### predict

Prediction (practice, not scored): api and db in one Compose stack; the API datasource URL is jdbc:postgresql://localhost:5432/shop. Answer: connection refused, because inside the api container localhost is the api container itself, and nothing listens on 5432 there. Sharing a laptop does not share localhost; publishing a db port only helps the laptop; Compose never rewrites localhost.

### explore

Activity: connection tests from inside the api container. localhost:5432: connection refused, because localhost is api itself and nothing listens on 5432 there. localhost:8080: reaches api itself, its own web server. db:5432: connects to PostgreSQL, because the service name db resolves on the shop_default network. db:15432: refused, because 15432 is the host port on the laptop; inside the network PostgreSQL listens on 5432.

### explore

Activity: choose addresses. A browser on the laptop opens the API at http://localhost:8080, the published host port; the name api only resolves inside the Compose network. The api container connects with jdbc:postgresql://db:5432/shop, the service name and the container port. A database tool on the laptop connects to localhost:15432, the published host port.

### mcq

Apply question: the db mapping becomes "127.0.0.1:6543:5432". The API URL stays jdbc:postgresql://db:5432/shop, because services use the service name and the container port, which did not change. db:6543 uses the host port inside the network; localhost from the api container is api itself. Retry as a pair: the API uses db:5432 and a laptop tool uses localhost:6543.
