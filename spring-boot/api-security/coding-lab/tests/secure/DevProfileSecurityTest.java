package secure;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

/**
 * Task 5: with the dev profile active, the open chain lets the front-end team
 * work without tokens. The default profile stays locked down - that is what
 * SecurityLabTest proves on every run.
 */
@SpringBootTest(properties = { "spring.main.banner-mode=off", "logging.level.root=warn" })
@AutoConfigureMockMvc
@ActiveProfiles("dev")
class DevProfileSecurityTest {

    @Autowired
    MockMvc mvc;

    @Test
    void task5DevProfileKeepsEndpointsOpen() throws Exception {
        mvc.perform(get("/admin/stats"))
                .andExpect(status().isOk());
        mvc.perform(get("/workshops"))
                .andExpect(status().isOk());
    }
}
