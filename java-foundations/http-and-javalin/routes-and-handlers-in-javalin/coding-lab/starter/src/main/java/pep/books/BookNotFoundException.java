package pep.books;

/** Thrown by BookStore.find when no book has the requested id. */
public class BookNotFoundException extends RuntimeException {

    public BookNotFoundException(String id) {
        super("No book with id " + id);
    }
}
