package pep.collections;

/**
 * Part 5 (topic: The equals and hashCode contract). A seat in a theater, identified by
 * row and number. Two seats with the same row and number must behave as one key in a
 * HashSet or HashMap, but this class still uses the identity equality it inherits from
 * Object.
 *
 * Add both equality methods yourself, using exactly the fields row and number:
 * equals with Objects.equals for row (a seat whose row is not yet assigned has a null row),
 * and hashCode with Objects.hash. Keep Seat a class: this part practises writing both methods.
 */
public final class Seat {
    private final String row;
    private final int number;

    public Seat(String row, int number) {
        this.row = row;
        this.number = number;
    }

    public String row() {
        return row;
    }

    public int number() {
        return number;
    }

    @Override
    public String toString() {
        return row + number;
    }
}
