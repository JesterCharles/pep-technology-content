package pep.books;

import io.javalin.Javalin;

/** The book API. The tests call create(...) and send real HTTP requests to the app it returns. */
public final class BookApp {

    private BookApp() {
    }

    public static Javalin create(BookStore books) {
        return Javalin.create(config -> {
            config.routes.get("/books", ctx -> ctx.json(books.all()));
            config.routes.get("/books/{id}", ctx -> ctx.json(books.find(ctx.pathParam("id"))));

            // TODO Task 1: register a POST /books handler. It reads the Book from the JSON
            // request body, saves it with books.save, sets status 201 and answers with the
            // saved book (the one save returns) as JSON.

            // TODO Task 2: register an exception handler for BookNotFoundException. It sets
            // status 404 and answers with a JSON object whose "error" field holds the
            // exception's message.
        });
    }

    public static void main(String[] args) {
        create(BookStore.withSampleBooks()).start(7070);
    }
}
