package workshops;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.hamcrest.Matchers;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.web.servlet.MockMvc;

/**
 * Public tests for the Spring Data JPA lab. They call the API over MockMvc and
 * check only responses. Until Task 1 maps the entity, the application context
 * cannot start, so every test errors; that is the expected starter state.
 */
@SpringBootTest(properties = { "spring.main.banner-mode=off", "logging.level.root=warn" })
@AutoConfigureMockMvc
class WorkshopJpaApiTest {

    @Autowired
    MockMvc mvc;

    @Test
    void task1MapsTheEntityAndListsTheSeededRows() throws Exception {
        mvc.perform(get("/workshops"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", Matchers.hasSize(4)))
                .andExpect(jsonPath("$[*].title", Matchers.hasItem("Spring Kickstart")));
    }

    @Test
    void task2DerivedQueryFiltersByCategorySortedByTitle() throws Exception {
        mvc.perform(get("/workshops/by-category").param("category", "spring"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", Matchers.hasSize(3)))
                .andExpect(jsonPath("$[0].title").value("Advanced Boot Testing"))
                .andExpect(jsonPath("$[1].title").value("Boot Camp Deep Dive"))
                .andExpect(jsonPath("$[2].title").value("Spring Kickstart"));
    }

    @Test
    void task3JpqlSearchMatchesAnyCase() throws Exception {
        mvc.perform(get("/workshops/search").param("q", "BOOT"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", Matchers.hasSize(2)))
                .andExpect(jsonPath("$[*].title", Matchers.hasItems(
                        "Boot Camp Deep Dive", "Advanced Boot Testing")));
    }

    @Test
    void task4PagesAndSortsWithStableJsonShape() throws Exception {
        mvc.perform(get("/workshops/page")
                        .param("page", "0").param("size", "2").param("sort", "seats,desc"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", Matchers.hasSize(2)))
                .andExpect(jsonPath("$.content[0].title").value("Spring Kickstart"))
                .andExpect(jsonPath("$.content[1].title").value("SQL Tuning Basics"))
                .andExpect(jsonPath("$.page.totalElements").value(4))
                .andExpect(jsonPath("$.page.totalPages").value(2));
    }

    @Test
    void task5ResponsesExposeOnlyTheDtoFields() throws Exception {
        mvc.perform(get("/workshops"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").isNumber())
                .andExpect(jsonPath("$[0].title").isString())
                .andExpect(jsonPath("$[0].internalNotes").doesNotExist());
        mvc.perform(get("/workshops/page").param("page", "0").param("size", "2"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].internalNotes").doesNotExist());
    }
}
