package bookings;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.mockingDetails;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

/**
 * You edit this file in Tasks 4 and 8: it is a web-layer slice test you
 * finish yourself. The steps are marked TODO; given, mock and verify are
 * already imported, and the Task 4 TODOs name the two imports you add.
 */
// TODO Task 4 step 1: run only the web layer for one controller - annotate this
// class with:
//   @WebMvcTest(BookingController.class)
// (import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest)
class WebLayerTest {

    private static final NewBooking POSTED =
            new NewBooking("Grace Hopper", "grace@example.com", 2);

    @Autowired(required = false)
    MockMvc mvc;

    // Used only by the shipped check at the end of Task 8.
    @Autowired(required = false)
    ApplicationContext context;

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

    @Test
    void task8VerifiesTheCreateCall() throws Exception {
        assertNotNull(mvc, "Task 4 step 1 missing: annotate this class with @WebMvcTest(BookingController.class)");
        mvc.perform(post("/bookings")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"attendee\":\"Grace Hopper\",\"email\":\"grace@example.com\",\"seats\":2}"))
                .andExpect(status().isCreated());
        // TODO Task 8 step 1: the response alone cannot show that the controller
        // passed the request on to the service. Here, verify on your mock that
        // the service's create method was called once, naming the booking that
        // was posted above as the argument.

        // Shipped check: every call on the context mock must be verified.
        BookingService mock = context.getBean(BookingService.class);
        assertTrue(mockingDetails(mock).getInvocations().stream()
                        .anyMatch(call -> java.util.Arrays.equals(call.getArguments(), new Object[] { POSTED })),
                "the controller's create call with the posted booking must remain recorded: verify it, do not reset the mock");
        verifyNoMoreInteractions(mock);
    }

    @Test
    void task8ShowsThatAPlainMockIsOnlyCalledWhenYouPassItIn() {
        BookingService plain = mock(BookingService.class);
        BookingController built = null;
        // TODO Task 8 step 3: replace null above with a BookingController that
        // you build yourself with this plain mock. Then call built's create
        // method with POSTED, and verify on the plain mock that create was
        // called with POSTED.

        // Shipped checks, leave them as they are: you built a controller, the
        // create call with POSTED is recorded and verified, no other call on the
        // plain mock is left unverified, and the context's mock is untouched.
        assertNotNull(built, "step 3 missing: replace null with a BookingController built with the plain mock");
        assertTrue(mockingDetails(plain).getInvocations().stream()
                        .anyMatch(call -> call.getMethod().getName().equals("create")
                                && java.util.Arrays.equals(call.getArguments(), new Object[] { POSTED })),
                "step 3: call create on the controller you built, with POSTED");
        verifyNoMoreInteractions(plain);
        // Probe: the controller you built must hand its calls to the plain mock.
        built.byId(5L);
        verify(plain).byId(5L);
        verifyNoMoreInteractions(plain);
        if (context != null) {
            verifyNoInteractions(context.getBean(BookingService.class));
        }
    }
}
