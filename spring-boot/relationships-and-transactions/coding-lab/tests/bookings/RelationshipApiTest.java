package bookings;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import jakarta.persistence.EntityManagerFactory;
import org.hamcrest.Matchers;
import org.hibernate.SessionFactory;
import org.hibernate.stat.Statistics;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

/**
 * Public tests for the relationships and transactions lab. Until Task 1 maps
 * the association, the application context cannot start, so every test errors;
 * that is the expected starter state.
 */
@SpringBootTest(properties = {
        "spring.main.banner-mode=off",
        "logging.level.root=warn",
        "spring.jpa.properties.hibernate.generate_statistics=true",
        "logging.level.org.hibernate.engine.internal.StatisticalLoggingSessionEventListener=off" })
@AutoConfigureMockMvc
@TestMethodOrder(MethodOrderer.MethodName.class)
class RelationshipApiTest {

    @Autowired
    MockMvc mvc;

    @Autowired
    EntityManagerFactory entityManagerFactory;

    @Test
    void task1MapsTheRelationshipAndServesASession() throws Exception {
        mvc.perform(get("/sessions/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.startDate").value("2027-01-12"))
                .andExpect(jsonPath("$.seatsLeft").value(12));
    }

    @Test
    void task2RollsBackTheFailedBooking() throws Exception {
        // Overbooking must fail AND leave the seat count untouched.
        mvc.perform(post("/sessions/1/bookings")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"attendee\":\"ada@example.com\",\"seats\":99}"))
                .andExpect(status().isConflict());
        mvc.perform(get("/sessions/1"))
                .andExpect(jsonPath("$.seatsLeft").value(12));
        // A normal booking still works.
        mvc.perform(post("/sessions/1/bookings")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"attendee\":\"ada@example.com\",\"seats\":2}"))
                .andExpect(status().isCreated());
        mvc.perform(get("/sessions/1"))
                .andExpect(jsonPath("$.seatsLeft").value(10));
    }

    @Test
    void task3LoadsTheSummariesWithoutNPlusOne() throws Exception {
        Statistics statistics = entityManagerFactory.unwrap(SessionFactory.class).getStatistics();
        statistics.clear();
        mvc.perform(get("/workshops/summary"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", Matchers.hasSize(3)))
                .andExpect(jsonPath("$[*].sessionCount", Matchers.hasItems(2, 1, 0)));
        assertEquals(0, statistics.getCollectionFetchCount(),
                "each workshop's sessions were fetched one by one: the N+1 pattern");
        assertTrue(statistics.getQueryExecutionCount() <= 2,
                "the summary listing should need one fetch-join query, not "
                        + statistics.getQueryExecutionCount());
    }

    @Test
    void task4ServesLazySessionsFromAReadOnlyTransaction() throws Exception {
        mvc.perform(get("/workshops/1/sessions"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", Matchers.hasSize(2)))
                .andExpect(jsonPath("$[*].startDate", Matchers.hasItem("2027-01-12")));
    }
}
