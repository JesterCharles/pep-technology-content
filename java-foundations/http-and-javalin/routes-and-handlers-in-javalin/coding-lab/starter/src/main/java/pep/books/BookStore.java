package pep.books;

import java.util.ArrayList;
import java.util.List;

/** A small in-memory book store. You use it; you do not need to change it. */
public class BookStore {

    private final List<Book> books = new ArrayList<>();
    private int nextId = 1;

    /** A store that already holds 1 Good Omens and 2 Small Gods. */
    public static BookStore withSampleBooks() {
        BookStore store = new BookStore();
        store.save(new Book(0, "Good Omens", 1990));
        store.save(new Book(0, "Small Gods", 1992));
        return store;
    }

    /** Every book, in the order they were saved. */
    public List<Book> all() {
        return List.copyOf(books);
    }

    /** Stores a copy of the book with the next id, and returns that saved copy. */
    public Book save(Book book) {
        Book saved = new Book(nextId++, book.title(), book.year());
        books.add(saved);
        return saved;
    }

    /** The book with this id, or a BookNotFoundException with the message "No book with id ...". */
    public Book find(String id) {
        for (Book book : books) {
            if (String.valueOf(book.id()).equals(id)) {
                return book;
            }
        }
        throw new BookNotFoundException(id);
    }
}
