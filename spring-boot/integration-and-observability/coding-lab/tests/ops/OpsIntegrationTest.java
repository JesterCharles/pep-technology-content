package ops;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.MockMvc;

/**
 * You edit this file in Task 1: an integration test you finish yourself.
 *
 * TODO Task 1: start the full application context and the web layer for this
 * test - annotate the class with:
 *   @SpringBootTest   (org.springframework.boot.test.context.SpringBootTest)
 *   @AutoConfigureMockMvc   (org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc)
 * A @WebMvcTest would start only the web slice and a @DataJpaTest only the
 * persistence slice; an integration test exercises the real wiring end to end.
 */
class OpsIntegrationTest {

    @Autowired(required = false)
    MockMvc mvc;

    @Test
    void task1BootsTheFullContextAndPingsIt() throws Exception {
        assertNotNull(mvc,
                "Task 1: annotate this class with @SpringBootTest and @AutoConfigureMockMvc");
        mvc.perform(get("/ping"))
                .andExpect(status().isOk())
                .andExpect(content().string("pong"));
    }
}
