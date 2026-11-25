package bookings;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mockingDetails;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.jayway.jsonpath.JsonPath;
import java.util.NoSuchElementException;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.availability.ApplicationAvailability;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

/**
 * You edit this file in Task 7: a web-layer slice test for the error paths,
 * with the service supplied by a simple fake instead of a mock. The four TODO
 * steps are below; the imports you need are already at the top of the file.
 * The checks after each TODO are shipped: leave them as they are.
 */
// TODO Task 7 step 1: make this class a test that starts only the web layer,
// for BookingController alone.
class ErrorSliceTest {

    @Autowired(required = false)
    MockMvc mvc;

    @Autowired(required = false)
    ApplicationContext context;

    // TODO Task 7 step 2: the slice loads no services. Declare a nested test
    // configuration class here whose bean is a fake BookingService that finds
    // nothing: its byId always throws NoSuchElementException.

    @Test
    void task7SliceAnswers404WhenTheFakeFindsNothing() throws Exception {
        assertSliceWithFake();
        MvcResult result = null;
        // TODO Task 7 step 3: replace null above with a GET of one booking by
        // id that expects status 404 and the problem title "Booking not found",
        // then keep the result with .andReturn().
        assertNotNull(result, "step 3 missing: perform the GET and keep its MvcResult");
        assertEquals("GET", result.getRequest().getMethod(), "step 3 must GET one booking");
        assertTrue(result.getRequest().getRequestURI().matches("/bookings/[1-9][0-9]*"),
                "step 3 must GET one booking by a positive id, so the request reaches the fake");
        assertEquals(404, result.getResponse().getStatus(), "the fake finds nothing, so the answer must be 404");
        assertEquals("Booking not found", JsonPath.read(result.getResponse().getContentAsString(), "$.title"),
                "the 404 must be your ApiErrors problem body");
    }

    @Test
    void task7SliceAnswers400ForAnInvalidBody() throws Exception {
        assertSliceWithFake();
        MvcResult result = null;
        // TODO Task 7 step 4: replace null above with a POST /bookings whose
        // JSON body has a blank attendee, an invalid email and 0 seats; expect
        // status 400 and the problem title "Validation failed", then keep the
        // result with .andReturn().
        assertNotNull(result, "step 4 missing: perform the invalid POST and keep its MvcResult");
        assertEquals("POST", result.getRequest().getMethod(), "step 4 must POST a booking");
        assertEquals("/bookings", result.getRequest().getRequestURI(), "step 4 must POST to /bookings");
        assertEquals(400, result.getResponse().getStatus(), "an invalid body must answer 400 before the service runs");
        String body = result.getResponse().getContentAsString();
        assertEquals("Validation failed", JsonPath.read(body, "$.title"),
                "the 400 must be your ApiErrors validation problem body");
        String detail = JsonPath.read(body, "$.detail");
        for (String field : new String[] { "attendee", "email", "seats" }) {
            assertTrue(detail.contains(field), "the body of step 4 must make " + field + " invalid");
        }
    }

    // Shipped check: the context must be the web-layer slice with your fake service.
    private void assertSliceWithFake() {
        assertNotNull(mvc, "step 1 missing: this class must start only the web layer");
        assertNotNull(context, "step 1 missing: this class must start only the web layer");
        // A full application context registers application-wide services such as
        // ApplicationAvailability; the web-layer slice does not.
        assertEquals(0, context.getBeanNamesForType(ApplicationAvailability.class).length,
                "step 1: start only the web layer for BookingController, not the full application context");
        // Booking 1 always exists in the real service, so every BookingService in
        // the context must be a non-mock fake that finds nothing: a full context
        // still holding the real service, or a Mockito mock, fails here.
        java.util.Collection<BookingService> services = context.getBeansOfType(BookingService.class).values();
        assertFalse(services.isEmpty(), "step 2 missing: declare the fake BookingService in a nested test configuration");
        for (BookingService service : services) {
            assertFalse(mockingDetails(service).isMock(),
                    "step 2: supply a fake BookingService, not a Mockito mock");
            assertThrows(NoSuchElementException.class, () -> service.byId(1L),
                    "step 1: start only the web layer, so the real BookingService (which finds booking 1) is not loaded;"
                            + " step 2: the fake must find nothing");
        }
    }
}
