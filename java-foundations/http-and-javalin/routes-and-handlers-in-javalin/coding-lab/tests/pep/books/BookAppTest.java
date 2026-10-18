package pep.books;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import io.javalin.testtools.JavalinTest;
import io.javalin.testtools.Response;
import org.junit.jupiter.api.Test;

/**
 * Public checks for the guided local run. Each test starts the app from BookApp.create on a free
 * localhost port, sends real HTTP requests to it, and checks only the responses.
 */
class BookAppTest {

    private static String contentType(Response response) {
        var types = response.headers().get("Content-Type");
        return types == null || types.isEmpty() ? "" : types.get(0);
    }

    @Test
    void task1PostAnswers201WithTheSavedBookAsJson() {
        JavalinTest.test(BookApp.create(BookStore.withSampleBooks()), (server, client) -> {
            var response = client.post("/books", "{\"title\":\"Dune\",\"year\":1965}");
            String body = response.body().string();
            assertEquals(201, response.code(),
                "Task 1: POST /books should answer status 201 Created; got " + response.code() + " with body " + body);
            assertTrue(contentType(response).startsWith("application/json"),
                "Task 1: POST /books should answer with JSON; Content-Type was " + contentType(response));
            assertEquals("{\"id\":3,\"title\":\"Dune\",\"year\":1965}", body,
                "Task 1: POST /books should answer with the saved book, which has id 3");
        });
    }

    @Test
    void task1SavedBookIsListedAfterwards() {
        JavalinTest.test(BookApp.create(BookStore.withSampleBooks()), (server, client) -> {
            client.post("/books", "{\"title\":\"Dune\",\"year\":1965}");
            String list = client.get("/books").body().string();
            assertTrue(list.contains("\"title\":\"Dune\""),
                "Task 1: after POST /books, GET /books should list Dune; got " + list);
        });
    }

    @Test
    void task2MissingBookAnswers404WithAJsonError() {
        JavalinTest.test(BookApp.create(BookStore.withSampleBooks()), (server, client) -> {
            var response = client.get("/books/99");
            String body = response.body().string();
            assertEquals(404, response.code(),
                "Task 2: GET /books/99 should answer status 404 Not Found; got " + response.code() + " with body " + body);
            assertTrue(contentType(response).startsWith("application/json"),
                "Task 2: GET /books/99 should answer with JSON; Content-Type was " + contentType(response));
            assertEquals("{\"error\":\"No book with id 99\"}", body,
                "Task 2: the JSON error body should hold the exception's message");
        });
    }

    @Test
    void existingBookStillAnswers200() {
        JavalinTest.test(BookApp.create(BookStore.withSampleBooks()), (server, client) -> {
            var response = client.get("/books/1");
            assertEquals(200, response.code(), "GET /books/1 should still answer 200 OK");
            assertEquals("{\"id\":1,\"title\":\"Good Omens\",\"year\":1990}", response.body().string(),
                "GET /books/1 should still answer with Good Omens as JSON");
        });
    }
}
