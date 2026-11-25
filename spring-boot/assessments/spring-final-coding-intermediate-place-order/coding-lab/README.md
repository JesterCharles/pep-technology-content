# Final Assessment coding challenge, Spring (intermediate, 20 minutes): place an order, all or nothing

## Goal

A campus shop takes orders for pickup through a Spring Boot API with an in-memory database seeded from `data.sql`.
Finish placing an order: `POST /api/orders` saves the order with its lines and reserves the stock, and an order that fails for any reason changes nothing.

**Time: 20 minutes from the end of setup, reading included.** Do the setup below before the timer starts. The controller, error handling, DTOs, `Product`, `OrderLine`, the repositories, seed data and checks are provided.

## What you edit

Two pieces, in `starter/src/main/java/pickup/`:

| File | What you write |
| --- | --- |
| `PickupOrder.java` | the body of `addLine(OrderLine line)` |
| `OrderService.java` | `place(NewOrder request)`; you may change anything in this class except that signature |

You may add classes in the `pickup` package. Leave every other file as it is, including the tests in `tests/`, `starter/pom.xml`, `expected/` and the files in `src/main/resources/`. Keep the `place` signature.

## Setup (before the timer, needs the internet once)

You need JDK 25 and Apache Maven 3.9 or later in the terminal (`java -version`, `mvn -v`).
Every command runs in the `starter` folder:

```
cd starter
mvn -q dependency:go-offline
mvn -q -o test
```

The first Maven command downloads the libraries once and prints nothing when it works. The second runs the checks: **all 8 fail before you start. That is expected.**

## What is provided

| Name | What it gives you |
| --- | --- |
| `NewOrder(customer, lines)` | the request body; each `NewOrder.Line` has `sku()` and `quantity()` |
| `ProductRepository.findBySku(sku)` | an `Optional<Product>` |
| `product.reserve(quantity)` | takes stock off the shelf; throws `InvalidQuantityException` (quantity below 1) or `NotEnoughStockException`, changing nothing |
| `ProductNotFoundException(sku)` | throw it for an unknown SKU (SKU: the product code, such as `PEN-BLK`) |
| `new PickupOrder(customer)`, `new OrderLine(sku, quantity)` | the entities; `PickupOrder.lines` is mapped with `cascade = CascadeType.ALL`, so saving an order saves the lines in its list |
| `line.setOrder(order)` | points the line at its order; this side fills the `order_id` column |
| `OrderRepository` | a `JpaRepository<PickupOrder, Long>` |
| `OrderResponse.from(order)` | builds the response from an order and its lines |
| the three exceptions | Spring already answers them with 404, 409 and 400 problem details |

## The task

1. Complete `PickupOrder.addLine` so both sides of the relationship are set: the order's list holds the line, and the line points back at the order.
2. Complete `OrderService.place`: create an order for `request.customer()`. For each line, find the product by SKU (`ProductNotFoundException` if unknown), call `product.reserve(quantity)`, and add a new `OrderLine` to the order. Save the order with its lines and return `OrderResponse.from` the saved order. The provided controller answers 201 with a `Location` header.
3. **All or nothing.** If any line fails (an unknown SKU, not enough stock, or a quantity below 1), no stock is reserved and no order or line is saved. Two lines may name the same SKU; together they may not take more than is on the shelf. The checks also make the database reject one write (the order, a line, a stock change, or the last write of the order). Your code must still leave everything unchanged.

## Test

Run the checks from `starter`:

```
mvn -q -o test
```

**You are finished when `mvn -q -o test` prints nothing at all.** Otherwise each failing check's name (they all start with `task1`) and message say what is still wrong. You are scored on the checks you pass. `expected/test-summary.txt` shows what a finished run looks like.

- `task1AddLineSetsBothSides` checks only `addLine`, without the database.
- `task1PlacesAnOrderWithItsLines` checks one placed order in full.
- The other 6 checks first place one normal order, which must be placed in full (201, stock reserved, the order and its lines saved). Until placing an order works, those 6 checks fail at that point.

One run takes about a minute or more (we measured 50 to 112 seconds per run on a busy machine), because it compiles your code and starts the application.

## Troubleshooting

- **`there is no POM in this directory`.** The terminal is not in `starter`. From the question folder, run `cd starter` and try again.
- **`COMPILATION ERROR`.** Your code does not compile yet, and no check can pass. Maven names the file, then `[line,column]`, then the problem.
- **`mvn -v` shows a Java version other than 25, or you see `release version 25 not supported`.** Set `JAVA_HOME` to your JDK 25 folder, then open a new terminal.
- **`Cannot access central in offline mode`, or a missing artifact.** The setup step has not finished. Run `mvn -q dependency:go-offline` once while online.

## Cleanup (optional)

Maven writes only the `starter/target` folder, and Git already ignores it. The database is in memory and disappears when the checks end.
