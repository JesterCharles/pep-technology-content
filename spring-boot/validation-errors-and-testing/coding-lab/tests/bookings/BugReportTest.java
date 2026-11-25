package bookings;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
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

/**
 * You edit this file in Task 5: reproduce a bug report in a MockMvc test
 * before you change any code (step 1), then predict the problem body Spring
 * will send once the bug is fixed (step 2). The imports you need are already
 * at the top of the file.
 *
 * The report: "GET /bookings/0 answers 404 Booking not found. Booking ids
 * start at 1, so 0 is a bad request from the client and should be a 400."
 */
@SpringBootTest(properties = { "spring.main.banner-mode=off", "logging.level.root=warn" })
@AutoConfigureMockMvc
class BugReportTest {

    // TODO Task 5 step 2: before you fix the bug, write the title and the
    // detail you expect in the problem body of the fixed GET /bookings/0.
    // Replace each null with your prediction in quotes.
    static final String PREDICTED_TITLE = null;
    static final String PREDICTED_DETAIL = null;

    @Autowired
    MockMvc mvc;

    @Test
    void task5ReproducesTheZeroIdReport() throws Exception {
        MvcResult result = null;
        // TODO Task 5 step 1: replace null above with the request the report
        // describes. Expect what the report says should happen, and keep the
        // result with .andReturn(). Run the tests before you fix anything:
        // this test must fail, because the bug is still there.
        assertNotNull(result, "step 1 missing: perform the reported request and keep its MvcResult");
        assertEquals("GET", result.getRequest().getMethod(),
                "the reproduction must send the request the report describes");
        assertEquals("/bookings/0", result.getRequest().getRequestURI(),
                "the reproduction must send the request the report describes, not another one that also fails");
        assertEquals(400, result.getResponse().getStatus(),
                "the reported request must answer 400, a client error");
    }

    @Test
    void task5PredictsTheProblemBodyOfTheFix() throws Exception {
        assertNotNull(PREDICTED_TITLE, "step 2 missing: write your predicted title in PREDICTED_TITLE");
        assertNotNull(PREDICTED_DETAIL, "step 2 missing: write your predicted detail in PREDICTED_DETAIL");
        assertFalse(PREDICTED_TITLE.isBlank(), "step 2 missing: write your predicted title in PREDICTED_TITLE");
        assertFalse(PREDICTED_DETAIL.isBlank(), "step 2 missing: write your predicted detail in PREDICTED_DETAIL");
        mvc.perform(get("/bookings/0"))
                .andExpect(status().isBadRequest())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_PROBLEM_JSON))
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.title").isString())
                .andExpect(jsonPath("$.detail").isString());
    }
}
