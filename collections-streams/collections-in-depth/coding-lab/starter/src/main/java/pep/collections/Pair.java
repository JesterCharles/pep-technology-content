package pep.collections;

import java.util.List;

/**
 * Part 3 (topic: Generics). A pair of two values with independent types A and B.
 * Store the two values in fields of type A and B; no casts are needed anywhere.
 */
public final class Pair<A, B> {

    public Pair(A first, B second) {
        // TODO store the values
    }

    public A first() {
        throw new UnsupportedOperationException("TODO Pair.first");
    }

    public B second() {
        throw new UnsupportedOperationException("TODO Pair.second");
    }

    /** Returns a new pair with the two values swapped: its first value has type B. */
    public Pair<B, A> swap() {
        throw new UnsupportedOperationException("TODO Pair.swap");
    }

    /** Generic method: returns the last element of a non-empty list, typed as T. */
    public static <T> T lastOf(List<T> list) {
        throw new UnsupportedOperationException("TODO Pair.lastOf");
    }
}
