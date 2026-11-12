package ops;

import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/** The web layer. Complete; you do not edit it. */
@RestController
public class StatusController {

    private final PartnerClient partner;

    public StatusController(PartnerClient partner) {
        this.partner = partner;
    }

    @GetMapping("/ping")
    public String ping() {
        return "pong";
    }

    @GetMapping("/status")
    public Map<String, String> status() {
        return Map.of("partner", partner.fetchStatus());
    }
}
