package ops;

/**
 * You edit this file in Task 4: a custom health contribution named "partner"
 * for /actuator/health.
 *
 * TODO Task 4: make this a real health indicator:
 *   1. annotate the class with @Component (org.springframework.stereotype.Component)
 *   2. implement HealthIndicator (org.springframework.boot.health.contributor.HealthIndicator,
 *      and Health from the same package)
 *   3. return Health.up().withDetail("baseUrl", properties.baseUrl()).build()
 *      from its health() method.
 */
public class PartnerHealthIndicator {

    private final PartnerProperties properties;

    public PartnerHealthIndicator(PartnerProperties properties) {
        this.properties = properties;
    }
}
