package catalog;

/** One catalog item, the same shape the Javalin version served. */
public record Item(int id, String name, int priceCents) {
}
