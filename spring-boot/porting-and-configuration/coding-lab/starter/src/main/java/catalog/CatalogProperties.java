package catalog;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Settings bound from the catalog.* properties. This record is complete; you
 * edit application.properties, not this file. pageSize is an Integer so the
 * application still starts while Task 3 has not set it yet. The admin token is
 * deliberately not here: AdminController reads it as a required property.
 */
@ConfigurationProperties("catalog")
public record CatalogProperties(String greeting, Integer pageSize) {
}
