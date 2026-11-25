# The shop, six months from now: a design review brief

You are reviewing the shop's growth plan. Nothing in this brief needs a
container engine or a cloud account; it is evidence for `decisions.yaml`.

## Where the system stands

The shop started as one Spring Boot application: catalog, checkout and, since
last quarter, product reviews. Three incidents drive this review:

1. A memory bug in the review-rendering code exhausted the heap and took
   checkout down with it for 40 minutes.
2. A one-line price-formatting fix could only ship by rebuilding, retesting
   and redeploying the whole application after hours.
3. During a review-writing promotion, review traffic grew tenfold while
   checkout traffic stayed flat, and the only way to add capacity was to run
   more copies of the whole application.

The team has started splitting reviews into its own FastAPI service (this
module's lab), with checkout staying in the Spring Boot api for now.

In the first sprint after the split, the reviews team is tempted to read the
shop api's `products` table directly from `reviews-db` queries "just for
launch week", instead of calling the api's HTTP endpoint.

The split's first production week also logged two new problems the monolith
never had: the on-call rota has twice the dashboards, images and logs to
watch, and every release now runs two deploy pipelines whose versions and
rollbacks must be tracked separately.

## Client traffic and discovery

A mobile app will join the browser client next quarter. It needs catalog,
checkout and reviews. The team wants one public entry point that routes each
request and checks login tokens once, before any service is reached, instead
of each of the three services repeating that check.

Two internal setups are on the table for finding service instances:

- **Setup A:** each calling service queries the team's service registry
  itself, gets the instance list and picks one.
- **Setup B:** callers send every request to a router at one well-known
  address; the router queries the registry and forwards each request.

Today, on the Compose network, containers already find each other by service
name through DNS, with no registry and no routing rules.

## Data

Three datasets are growing:

- **Request counters:** one small number per client, read and incremented
  by client id only and reset every minute. No joins, no other lookups.
- **Order history:** money. Multi-row writes that must commit or roll back
  together, plus reporting joins to customers and products.
- **Review bodies:** nested text records whose fields keep changing between
  app versions; pages filter them by fields such as stars and product.

The team asks whether one database technology must serve all three, or what
would let each service choose its own.

Before agreeing, a new teammate asks you to contrast the three store types on
the three taught questions: how each one handles schema, how each one is
queried, and what consistency each one typically gives.

## Delivery

A sister team runs Jenkins; the shop runs GitHub Actions. Their Jenkinsfile
lists a Test stage and then a Build stage; the shop's workflow has `test` and
`build` jobs. The teams keep confusing what runs in order and what runs in
parallel.

After images are pushed, the platform group runs them on Kubernetes. They ask
you to name which object keeps three replicas of `reviews` running and which
object gives those changing Pods one stable address.

Finally, release policy: every green build of `main` goes to staging and,
once staging's smoke checks pass, on to production by itself. Nobody approves
a release. The team wants the right name for the practice they already have.

The workflow pushes the `reviews` image to Docker Hub. Docker Hub is not part
of GitHub, so the workflow's own `GITHUB_TOKEN` cannot sign in there: the
login uses two repository secrets, `REGISTRY_USERNAME` and
`REGISTRY_PASSWORD`.
