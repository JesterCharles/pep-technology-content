package secure;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

/**
 * Tasks 5 and 6: with the dev profile active, the open chain lets the
 * front-end team work without tokens, and the browser may call the API from
 * the local front-end origin only. The default profile stays locked down -
 * that is what SecurityLabTest proves on every run.
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

    @Test
    void task6DevProfileAllowsOnlyTheLocalFrontEndOrigin() throws Exception {
        // The browser's preflight from the Vite dev server is allowed, for exactly that origin.
        mvc.perform(options("/admin/stats")
                        .header("Origin", "http://localhost:5173")
                        .header("Access-Control-Request-Method", "GET"))
                .andExpect(status().isOk())
                .andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:5173"));
        // Any other origin is refused: no wildcard.
        mvc.perform(options("/admin/stats")
                        .header("Origin", "http://localhost:3000")
                        .header("Access-Control-Request-Method", "GET"))
                .andExpect(status().isForbidden())
                .andExpect(header().doesNotExist("Access-Control-Allow-Origin"));
    }
}
