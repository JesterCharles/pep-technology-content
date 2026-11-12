package bookings;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.MockMvc;

/**
 * You edit this file in Task 4: it is a web-layer slice test you finish
 * yourself. The three steps are marked TODO; the imports you need (including
 * WebMvcTest, MockitoBean and BDDMockito.given) are listed in the README.
 */
// TODO Task 4 step 1: run only the web layer for one controller - annotate this
// class with:
//   @WebMvcTest(BookingController.class)
// (import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest)
class WebLayerTest {

    @Autowired(required = false)
    MockMvc mvc;

    // TODO Task 4 step 2: a @WebMvcTest loads no services, so replace the one the
    // controller needs with a Mockito mock managed by Spring - declare the field:
    //   @MockitoBean
    //   BookingService service;
    // (import org.springframework.test.context.bean.override.mockito.MockitoBean)

    @Test
    void task4StubsTheServiceWithMockitoBean() throws Exception {
        assertNotNull(mvc, "step 1 missing: annotate this class with @WebMvcTest(BookingController.class)");
        // TODO Task 4 step 3: stub the mock so the controller has something to
        // serve - before the request below, add:
        //   given(service.byId(7L)).willReturn(new Booking(7L, "Grace Hopper", "grace@example.com", 2));
        mvc.perform(get("/bookings/7"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.attendee").value("Grace Hopper"))
                .andExpect(jsonPath("$.seats").value(2));
    }
}
