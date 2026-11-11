package bookings;

import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

/** Tasks 1-3: validation and error handling, checked over MockMvc. */
@SpringBootTest(properties = { "spring.main.banner-mode=off", "logging.level.root=warn" })
@AutoConfigureMockMvc
class ValidationApiTest {

    @Autowired
    MockMvc mvc;

    private static final String INVALID =
            "{\"attendee\":\"\",\"email\":\"not-an-email\",\"seats\":0}";

    @Test
    void task1RejectsAnInvalidBookingWith400() throws Exception {
        mvc.perform(post("/bookings")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(INVALID))
                .andExpect(status().isBadRequest());
        // A valid booking still goes through.
        mvc.perform(post("/bookings")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"attendee\":\"Grace Hopper\",\"email\":\"grace@example.com\",\"seats\":1}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.attendee").value("Grace Hopper"));
    }

    @Test
    void task2TurnsAnUnknownIdIntoAProblem404() throws Exception {
        mvc.perform(get("/bookings/999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.title").value("Booking not found"));
    }

    @Test
    void task3AnswersValidationFailuresWithProblemDetail() throws Exception {
        mvc.perform(post("/bookings")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(INVALID))
                .andExpect(status().isBadRequest())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_PROBLEM_JSON))
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.detail", containsString("seats")))
                .andExpect(jsonPath("$.detail", containsString("email")));
    }
}
