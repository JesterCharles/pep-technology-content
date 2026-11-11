package catalog;

import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.web.servlet.MockMvc;

/** Tasks 1, 2, 3 and 5: the ported API and its configuration, checked over MockMvc. */
@SpringBootTest(properties = { "spring.main.banner-mode=off", "logging.level.root=warn" })
@AutoConfigureMockMvc
class ItemApiTest {

    @Autowired
    MockMvc mvc;

    @Test
    void task1ListsTheCatalogItems() throws Exception {
        mvc.perform(get("/items"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[*].name", hasItem("Laptop stand")));
    }

    @Test
    void task2PortsTheDetailRouteAndIts404() throws Exception {
        mvc.perform(get("/items/2"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("USB-C cable"))
                .andExpect(jsonPath("$.priceCents").value(1200));
        mvc.perform(get("/items/99"))
                .andExpect(status().isNotFound());
    }

    @Test
    void task3CapsTheListingAtThePageSize() throws Exception {
        mvc.perform(get("/items"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(3)))
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[2].id").value(3));
    }

    @Test
    void task5ReadsTheAdminTokenFromTheEnvironment() throws Exception {
        // The build sets the environment variable ADMIN_TOKEN=test-only-token.
        mvc.perform(get("/admin/ping").header("X-Admin-Token", "test-only-token"))
                .andExpect(status().isNoContent());
        // The committed token must stop working once the property reads the environment.
        mvc.perform(get("/admin/ping").header("X-Admin-Token", "letmein"))
                .andExpect(status().isUnauthorized());
    }
}
