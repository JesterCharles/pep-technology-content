package workshops;

/** One workshop in the catalog, serialized to JSON by Spring. */
public record Workshop(int id, String title, int seats) {
}
