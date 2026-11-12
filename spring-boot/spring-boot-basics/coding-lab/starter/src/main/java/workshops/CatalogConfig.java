package workshops;

import java.util.List;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Defines the one WorkshopCatalog bean the application should use.
 * This class is complete; you do not edit it.
 */
@Configuration
public class CatalogConfig {

    @Bean
    public WorkshopCatalog workshopCatalog() {
        return new WorkshopCatalog(List.of(
                new Workshop(1, "Spring Kickstart", 20),
                new Workshop(2, "REST Deep Dive", 8)));
    }
}
