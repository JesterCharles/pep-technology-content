package pep.books;

/** One book. The store gives each saved book its id; a book read from a request body has id 0. */
public record Book(int id, String title, int year) {
}
