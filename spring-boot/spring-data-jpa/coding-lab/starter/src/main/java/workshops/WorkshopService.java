package workshops;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

/**
 * You edit this file in Tasks 2, 3 and 4. The service owns all repository
 * calls; the controller never touches the repository directly.
 */
@Service
public class WorkshopService {

    private final WorkshopRepository repository;

    public WorkshopService(WorkshopRepository repository) {
        this.repository = repository;
    }

    public List<Workshop> all() {
        return repository.findAll();
    }

    public List<Workshop> byCategory(String category) {
        // TODO Task 2: call your derived query method instead.
        return List.of();
    }

    public List<Workshop> search(String q) {
        // TODO Task 3: call your @Query method instead.
        return List.of();
    }

    public Page<Workshop> page(Pageable pageable) {
        // TODO Task 4: return repository.findAll(pageable) so page, size and
        // sort from the request reach the database.
        return Page.empty();
    }
}
