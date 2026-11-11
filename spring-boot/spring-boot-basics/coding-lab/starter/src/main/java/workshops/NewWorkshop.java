package workshops;

/** The request body for creating a workshop; the id is assigned by the catalog. */
public record NewWorkshop(String title, int seats) {
}
