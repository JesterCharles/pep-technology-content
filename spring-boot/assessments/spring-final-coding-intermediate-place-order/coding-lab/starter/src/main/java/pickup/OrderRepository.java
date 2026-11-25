package pickup;

import org.springframework.data.jpa.repository.JpaRepository;

/** Provided and complete. */
public interface OrderRepository extends JpaRepository<PickupOrder, Long> {
}
