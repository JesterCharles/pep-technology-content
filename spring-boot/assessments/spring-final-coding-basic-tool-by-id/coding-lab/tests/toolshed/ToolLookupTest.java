package toolshed;

import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.not;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertInstanceOf;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.jayway.jsonpath.JsonPath;
import java.util.List;
import java.util.Map;
import java.util.Set;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.ResultActions;

/**
 * Public checks for the Final Assessment coding challenge, Spring (basic,
 * 10 minutes). The five tools come from data.sql (ids 1 to 5). Every check
 * only reads, so they share one application context. MissingToolProbe (in
 * this folder) is a second, test-only controller: only a global
 * @RestControllerAdvice answers its ToolNotFoundException.
 */
@SpringBootTest(properties = { "spring.main.banner-mode=off", "logging.level.root=warn" })
@AutoConfigureMockMvc
class ToolLookupTest {

    static final Set<String> TOOL_FIELDS = Set.of("id", "assetTag", "name", "category", "replacementCost");
    static final List<String> STAFF_NOTES = List.of(
            "invoice 2291", "donated", "warranty to 2027-03", "grant purchase G-14", "replaces stolen unit");

    @Autowired
    MockMvc mvc;

    @Autowired
    ToolService service;

    @Test
    void task1ReturnsTheToolWithThatId() throws Exception {
        String body = mvc.perform(get("/api/tools/4"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(4))
                .andExpect(jsonPath("$.assetTag").value("GDN-001"))
                .andExpect(jsonPath("$.name").value("Hedge trimmer"))
                .andExpect(jsonPath("$.category").value("garden"))
                .andExpect(jsonPath("$.replacementCost").value(180))
                .andReturn().getResponse().getContentAsString();
        Map<String, Object> tool = JsonPath.read(body, "$");
        assertEquals(TOOL_FIELDS, tool.keySet(), "the tool must be returned as a ToolResponse, not the Tool entity");
        mvc.perform(get("/api/tools/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.assetTag").value("PWR-001"))
                .andExpect(jsonPath("$.name").value("Cordless drill"));
    }

    @Test
    void task1ReturnsOnlyTheToolResponseFields() throws Exception {
        for (int id = 1; id <= 5; id++) {
            String body = mvc.perform(get("/api/tools/" + id))
                    .andExpect(status().isOk())
                    .andReturn().getResponse().getContentAsString();
            Map<String, Object> tool = JsonPath.read(body, "$");
            assertEquals(TOOL_FIELDS, tool.keySet(),
                    "GET /api/tools/" + id + " must answer with exactly the ToolResponse fields " + TOOL_FIELDS);
            for (String note : STAFF_NOTES) {
                assertFalse(body.contains(note), "a staff-only purchase note leaked into a response: " + note);
            }
        }
    }

    @Test
    void task1TheServiceThrowsToolNotFoundException() {
        assertEquals("PWR-002", service.byId(3).getAssetTag(), "ToolService.byId(3) should return tool 3");
        assertThrows(ToolNotFoundException.class, () -> service.byId(999),
                "ToolService.byId must throw ToolNotFoundException for an id that does not exist");
    }

    @Test
    void task1AnUnknownIdIsA404ProblemDetail() throws Exception {
        MvcResult result = mvc.perform(get("/api/tools/999"))
                .andExpect(status().isNotFound())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_PROBLEM_JSON))
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.title").value("Tool not found"))
                .andReturn();
        assertInstanceOf(ToolNotFoundException.class, result.getResolvedException(),
                "the 404 should come from the ToolNotFoundException that ToolService throws, handled in ApiErrors");
        probe()
                .andExpect(status().isNotFound())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_PROBLEM_JSON))
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.title").value("Tool not found"));
        MvcResult notANumber = mvc.perform(get("/api/tools/abc")).andReturn();
        assertEquals(400, notANumber.getResponse().getStatus(),
                "GET /api/tools/abc (not a number) must keep Spring's own 400 answer: "
                        + "handle only ToolNotFoundException in ApiErrors, not every exception");
    }

    @Test
    void task1TheProblemDetailNamesTheIdAndHidesInternals() throws Exception {
        mvc.perform(get("/api/tools/77"))
                .andExpect(status().isNotFound())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_PROBLEM_JSON))
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.detail").value("No tool with id 77"))
                .andExpect(jsonPath("$.instance").value("/api/tools/77"))
                .andExpect(jsonPath("$.trace").doesNotExist())
                .andExpect(content().string(not(containsString("Exception"))));
        probe()
                .andExpect(status().isNotFound())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_PROBLEM_JSON))
                .andExpect(jsonPath("$.detail").value("No tool with id 55"))
                .andExpect(jsonPath("$.instance").value(MissingToolProbe.PATH))
                .andExpect(content().string(not(containsString("Exception"))));
    }

    /** GET on the test-only MissingToolProbe, which throws ToolNotFoundException(55) from another controller. */
    ResultActions probe() {
        try {
            return mvc.perform(get(MissingToolProbe.PATH));
        } catch (Exception unhandled) {
            throw new AssertionError("ToolNotFoundException thrown by another controller (tests/toolshed/MissingToolProbe) "
                    + "was not handled: handle it in ApiErrors, the global @RestControllerAdvice, "
                    + "not inside ToolController", unhandled);
        }
    }
}
