package ops;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withServerError;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.restclient.test.autoconfigure.RestClientTest;
import org.springframework.boot.test.system.CapturedOutput;
import org.springframework.boot.test.system.OutputCaptureExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.MockRestServiceServer;

/**
 * Tasks 2 and 3: the outbound call, tested without the partner service running.
 * MockRestServiceServer intercepts the client's requests; no network is used.
 */
@RestClientTest(PartnerClient.class)
@EnableConfigurationProperties(PartnerProperties.class)
@ExtendWith(OutputCaptureExtension.class)
class PartnerClientTest {

    @Autowired
    PartnerClient client;

    @Autowired
    MockRestServiceServer server;

    @Test
    void task2CallsThePartnerStatusEndpoint() {
        server.expect(requestTo("https://partner.example/api/status"))
                .andRespond(withSuccess("{\"status\":\"OK\"}", MediaType.APPLICATION_JSON));
        assertEquals("OK", client.fetchStatus(),
                "fetchStatus should GET {base-url}/status and return the status field");
        server.verify();
    }

    @Test
    void task3TurnsAPartnerFailureIntoUnknownAndALogLine(CapturedOutput output) {
        server.expect(requestTo("https://partner.example/api/status"))
                .andRespond(withServerError());
        assertEquals("UNKNOWN", client.fetchStatus(),
                "a partner failure must come back as UNKNOWN, not as an exception");
        assertTrue(output.getOut().contains("partner status check failed")
                        || output.getErr().contains("partner status check failed"),
                "log a warning containing 'partner status check failed'");
    }
}
