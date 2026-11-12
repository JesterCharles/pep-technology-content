package ops;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

/**
 * You edit this file in Tasks 2 and 3. The client is built once from the
 * auto-configured builder: the base URL comes from partner.base-url, and the
 * connect/read timeouts from the spring.http.clients.* properties (see
 * application.properties).
 */
@Component
public class PartnerClient {

    private static final Logger log = LoggerFactory.getLogger(PartnerClient.class);

    private final RestClient client;

    public PartnerClient(RestClient.Builder builder, PartnerProperties properties) {
        this.client = builder.baseUrl(properties.baseUrl()).build();
    }

    /**
     * Asks the partner service for its status.
     *
     * TODO Task 2: perform the call and return the status string:
     *   return client.get().uri("/status").retrieve().body(PartnerStatus.class).status();
     *
     * TODO Task 3: a partner outage must not break OUR api. Wrap the call in
     * try/catch (RestClientException), log a warning
     *   log.warn("partner status check failed: {}", exception.getMessage());
     * and return "UNKNOWN" in that case.
     */
    public String fetchStatus() {
        return "TODO";
    }
}
