package workshops;

import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.not;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

/**
 * Public tests for the Spring Boot Basics lab. They call the API over MockMvc
 * and check only responses: status codes and JSON bodies.
 */
@SpringBootTest(properties = { "spring.main.banner-mode=off", "logging.level.root=warn" })
@AutoConfigureMockMvc
@TestMethodOrder(MethodOrderer.MethodName.class)
class WorkshopApiTest {

    @Autowired
    MockMvc mvc;

    @Test
    void task1ListsTheSeededWorkshops() throws Exception {
        mvc.perform(get("/workshops"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[*].title", hasItem("Spring Kickstart")))
                .andExpect(jsonPath("$[*].title", hasItem("REST Deep Dive")));
    }

    @Test
    void task2FindsOneWorkshopByItsId() throws Exception {
        mvc.perform(get("/workshops/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.title").value("Spring Kickstart"))
                .andExpect(jsonPath("$.seats").value(20));
    }

    @Test
    void task3UnknownWorkshopIdGives404() throws Exception {
        mvc.perform(get("/workshops/2"))
                .andExpect(status().isOk());
        mvc.perform(get("/workshops/999"))
                .andExpect(status().isNotFound());
    }

    @Test
    void task4FiltersWorkshopsByMinSeats() throws Exception {
        mvc.perform(get("/workshops").param("minSeats", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[*].title", hasItem("Spring Kickstart")))
                .andExpect(jsonPath("$[*].title", not(hasItem("REST Deep Dive"))));
    }

    @Test
    void task5CreateReturns201AndTheCreatedWorkshop() throws Exception {
        mvc.perform(post("/workshops")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"title\":\"Testing Lab\",\"seats\":6}"))
                .andExpect(status().isCreated())
                .andExpect(header().string("Location", "/workshops/3"))
                .andExpect(jsonPath("$.id").value(3))
                .andExpect(jsonPath("$.title").value("Testing Lab"))
                .andExpect(jsonPath("$.seats").value(6));
    }
}
