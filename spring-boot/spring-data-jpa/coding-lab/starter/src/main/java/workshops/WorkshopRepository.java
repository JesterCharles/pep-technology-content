package workshops;

import org.springframework.data.jpa.repository.JpaRepository;

/**
 * You edit this file in Tasks 2 and 3.
 * JpaRepository already gives you findAll, findById, save and friends.
 */
public interface WorkshopRepository extends JpaRepository<Workshop, Long> {

    // TODO Task 2: declare a derived query method that finds every workshop in a
    // category, ordered by title ascending. Spring Data derives the SQL from the
    // method name alone: findByCategoryOrderByTitleAsc(String category).

    // TODO Task 3: declare a search method with a JPQL @Query and a named
    // parameter, matching workshops whose title contains the search text in any
    // case, e.g.:
    //   @Query("select w from Workshop w where lower(w.title) like lower(concat('%', :q, '%'))")
    //   List<Workshop> searchByTitle(@Param("q") String q);
}
