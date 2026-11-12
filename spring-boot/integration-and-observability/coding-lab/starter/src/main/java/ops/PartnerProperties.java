package ops;

import org.springframework.boot.context.properties.ConfigurationProperties;

/** The partner service settings, bound from partner.*. Complete; you do not edit it. */
@ConfigurationProperties("partner")
public record PartnerProperties(String baseUrl) {
}
