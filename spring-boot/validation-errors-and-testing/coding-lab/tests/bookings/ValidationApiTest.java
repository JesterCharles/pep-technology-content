package bookings;

import static org.hamcrest.Matchers.containsString;
import static org.junit.jupiter.api.Assertions.assertInstanceOf;
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
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.web.method.annotation.HandlerMethodValidationException;

/** Tasks 1-3, 5 and 6: validation and error handling, checked over MockMvc. */
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

    @Test
    void task5RejectsANonPositiveIdWith400() throws Exception {
        // The 400 must come from Spring's method validation of a constraint on the
        // id parameter: the exception Spring resolved for the request shows that.
        for (String id : new String[] { "0", "-3" }) {
            MvcResult result = mvc.perform(get("/bookings/" + id))
                    .andExpect(status().isBadRequest())
                    .andReturn();
            assertInstanceOf(HandlerMethodValidationException.class, result.getResolvedException(),
                    "Task 5: reject id " + id + " with a Bean Validation constraint on the byId parameter, so Spring's"
                            + " method validation answers the 400, not a check you wrote by hand");
        }
        // A positive id that does not exist is still a 404, and a real one still a 200.
        mvc.perform(get("/bookings/999"))
                .andExpect(status().isNotFound());
        mvc.perform(get("/bookings/1"))
                .andExpect(status().isOk());
    }

    @Test
    void task6AnswersFrameworkErrorsWithProblemDetail() throws Exception {
        // No handler of yours covers these two: Spring MVC's built-in problem details must.
        mvc.perform(post("/bookings")
                        .contentType(MediaType.TEXT_PLAIN)
                        .content("Grace Hopper, 1 seat"))
                .andExpect(status().isUnsupportedMediaType())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_PROBLEM_JSON))
                .andExpect(jsonPath("$.status").value(415))
                .andExpect(jsonPath("$.title").value("Unsupported Media Type"));
        mvc.perform(post("/bookings")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"attendee\":"))
                .andExpect(status().isBadRequest())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_PROBLEM_JSON))
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.title").value("Bad Request"));
    }
}
