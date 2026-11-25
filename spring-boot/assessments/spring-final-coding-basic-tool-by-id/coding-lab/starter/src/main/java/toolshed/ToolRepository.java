package toolshed;

import org.springframework.data.jpa.repository.JpaRepository;

/** Provided and complete. JpaRepository already gives you findById(id). */
public interface ToolRepository extends JpaRepository<Tool, Long> {
}
