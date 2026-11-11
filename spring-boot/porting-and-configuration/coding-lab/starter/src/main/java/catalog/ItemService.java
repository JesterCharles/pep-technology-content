package catalog;

import java.util.List;
import java.util.NoSuchElementException;
import org.springframework.stereotype.Service;

/**
 * The service ported from Java Foundations. This class is complete; you do not
 * edit it. It already uses constructor injection: a final field assigned from
 * a constructor parameter, no @Autowired on a field.
 */
@Service
public class ItemService {

    private final ItemRepository repository;
    private final CatalogProperties properties;

    public ItemService(ItemRepository repository, CatalogProperties properties) {
        this.repository = repository;
        this.properties = properties;
    }

    /** Returns the catalog, capped at catalog.page-size when that property is set. */
    public List<Item> list() {
        List<Item> items = repository.findAll();
        Integer pageSize = properties.pageSize();
        if (pageSize == null || pageSize >= items.size()) {
            return items;
        }
        return items.subList(0, pageSize);
    }

    /** Returns one item, or throws NoSuchElementException like the Javalin version did. */
    public Item byId(int id) {
        return repository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("No item with id " + id));
    }
}
