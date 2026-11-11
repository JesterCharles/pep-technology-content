package catalog;

import org.springframework.web.bind.annotation.RestController;

/**
 * You edit this file in Tasks 1 and 2. The Javalin original you are porting:
 *
 *   app.get("/items", ctx -> ctx.json(service.list()));
 *   app.get("/items/{id}", ctx -> ctx.json(service.byId(Integer.parseInt(ctx.pathParam("id")))));
 *   app.exception(NoSuchElementException.class, (e, ctx) -> ctx.status(404));
 */
@RestController
public class ItemController {

    // TODO Task 1: declare a `private final ItemService service;` field and assign
    // it from a constructor parameter, then add a GET /items handler method that
    // returns service.list().

    // TODO Task 2: add a GET /items/{id} handler that returns service.byId(id),
    // and port the Javalin exception mapping: an @ExceptionHandler(NoSuchElementException.class)
    // method annotated @ResponseStatus(HttpStatus.NOT_FOUND) (or returning
    // ResponseEntity with status 404), so an unknown id answers 404 instead of 500.
}
