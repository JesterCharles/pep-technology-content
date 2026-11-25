package pickup;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/** Test-owned reads of what is really in the database, through the provided entities. */
final class ShopState {

    private final EntityManagerFactory entityManagerFactory;

    ShopState(EntityManagerFactory entityManagerFactory) {
        this.entityManagerFactory = entityManagerFactory;
    }

    /** SKU to stock, by SKU ascending: NB-A5, PEN-BLK, USB-32. */
    Map<String, Integer> stock() {
        try (EntityManager em = entityManagerFactory.createEntityManager()) {
            Map<String, Integer> stock = new LinkedHashMap<>();
            em.createQuery("select p from Product p order by p.sku", Product.class).getResultList()
                    .forEach(p -> stock.put(p.getSku(), p.getStock()));
            return stock;
        }
    }

    long orderCount() {
        try (EntityManager em = entityManagerFactory.createEntityManager()) {
            return em.createQuery("select count(o) from PickupOrder o", Long.class).getSingleResult();
        }
    }

    long lineCount() {
        try (EntityManager em = entityManagerFactory.createEntityManager()) {
            return em.createQuery("select count(l) from OrderLine l", Long.class).getSingleResult();
        }
    }

    String customerOf(long orderId) {
        try (EntityManager em = entityManagerFactory.createEntityManager()) {
            return em.createQuery("select o.customer from PickupOrder o where o.id = :id", String.class)
                    .setParameter("id", orderId).getSingleResult();
        }
    }

    /** "SKU xQuantity" for each saved line linked to this order, in line order. */
    List<String> linesOf(long orderId) {
        try (EntityManager em = entityManagerFactory.createEntityManager()) {
            return em.createQuery("select l from OrderLine l where l.order.id = :id order by l.id", OrderLine.class)
                    .setParameter("id", orderId).getResultList().stream()
                    .map(l -> l.getSku() + " x" + l.getQuantity()).toList();
        }
    }
}
