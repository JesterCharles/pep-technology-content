package workshops;

import static org.hamcrest.Matchers.hasItem;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.net.URL;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ApplicationContext;
import org.springframework.core.env.Environment;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

/**
 * Public tests for Tasks 1 to 6 of the Spring Boot Basics lab. They call the API
 * over MockMvc and check responses (status codes and JSON bodies); Task 4 checks
 * the two settings the application reads from application.properties.
 */
@SpringBootTest(properties = { "spring.main.banner-mode=off", "logging.level.root=warn" })
@AutoConfigureMockMvc
@TestMethodOrder(MethodOrderer.MethodName.class)
class WorkshopApiTest {

    @Autowired
    MockMvc mvc;

    @Autowired
    Environment env;

    @Autowired
    ApplicationContext ctx;

    @Test
    void task1ListsTheSeededWorkshops() throws Exception {
        assertEquals(1, ctx.getBeansOfType(WorkshopCatalog.class).size(),
                "Task 1: WorkshopCatalog must be registered as exactly one Spring bean (a @Bean method in CatalogConfig)");
        mvc.perform(get("/workshops"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[*].title", hasItem("Spring Kickstart")))
                .andExpect(jsonPath("$[*].title", hasItem("REST Deep Dive")));
    }

    @Test
    void task2FindsOneWorkshopByItsIdOr404() throws Exception {
        mvc.perform(get("/workshops/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.title").value("Spring Kickstart"))
                .andExpect(jsonPath("$.seats").value(20));
        mvc.perform(get("/workshops/999"))
                .andExpect(status().isNotFound());
    }

    @Test
    void task3CreateReturns201AndTheCreatedWorkshop() throws Exception {
        mvc.perform(post("/workshops")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"title\":\"Testing Lab\",\"seats\":6}"))
                .andExpect(status().isCreated())
                .andExpect(header().string("Location", org.hamcrest.Matchers.endsWith("/workshops/3")))
                .andExpect(jsonPath("$.id").value(3))
                .andExpect(jsonPath("$.title").value("Testing Lab"))
                .andExpect(jsonPath("$.seats").value(6));
    }

    @Test
    void task4ApplicationPropertiesNameTheServiceAndPort() {
        URL settings = getClass().getClassLoader().getResource("application.properties");
        assertNotNull(settings, "no application.properties on the classpath");
        assertTrue(settings.toString().endsWith("/classes/application.properties"),
                "application.properties must be built from src/main/resources, found " + settings);
        assertEquals("workshop-catalog", env.getProperty("spring.application.name"),
                "spring.application.name, read from starter/src/main/resources/application.properties");
        assertEquals("8081", env.getProperty("server.port"),
                "server.port, read from starter/src/main/resources/application.properties");
    }

    @Test
    void task5ScanningFindsTheAboutController() throws Exception {
        mvc.perform(get("/about"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.description").value("Workshop catalog lab"));
    }

    @Test
    void task6AvailabilityFollowsTheOpenApiContract() throws Exception {
        mvc.perform(get("/workshops/1/availability").param("groupSize", "12"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.workshopId").value(1))
                .andExpect(jsonPath("$.groupSize").value(12))
                .andExpect(jsonPath("$.bookable").value(true));
        mvc.perform(get("/workshops/1/availability").param("groupSize", "20"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.bookable").value(true));
        mvc.perform(get("/workshops/2/availability").param("groupSize", "12"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.bookable").value(false));
        mvc.perform(get("/workshops/999/availability").param("groupSize", "2"))
                .andExpect(status().isNotFound());
        mvc.perform(get("/workshops/1/availability"))
                .andExpect(status().isBadRequest());
        mvc.perform(get("/workshops/1/availability").param("groupSize", "abc"))
                .andExpect(status().isBadRequest());
    }
}
