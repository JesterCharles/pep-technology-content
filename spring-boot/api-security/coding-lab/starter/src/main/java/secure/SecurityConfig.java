package secure;

import com.nimbusds.jose.jwk.source.ImmutableSecret;
import java.nio.charset.StandardCharsets;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;

/**
 * You edit this file in Tasks 1 and 2 (and give its chain a profile in Task 5).
 * The JWT plumbing below is complete: both sides share the HMAC key from the
 * jwt.secret property, and the converter turns the token's roles claim into
 * ROLE_* authorities.
 */
@Configuration
public class SecurityConfig {

    // TODO Task 1: define the password hashing bean:
    //   @Bean
    //   public PasswordEncoder passwordEncoder() {
    //       return PasswordEncoderFactories.createDelegatingPasswordEncoder();
    //   }
    // (org.springframework.security.crypto.factory.PasswordEncoderFactories,
    //  org.springframework.security.crypto.password.PasswordEncoder)

    // TODO Task 2: define the security rules (and in Task 5, annotate this
    // method with @Profile("!dev")):
    //   @Bean
    //   public SecurityFilterChain filterChain(HttpSecurity http,
    //           JwtAuthenticationConverter jwtAuthenticationConverter) throws Exception {
    //       http
    //           .csrf(csrf -> csrf.disable())
    //           .authorizeHttpRequests(auth -> auth
    //               .requestMatchers(HttpMethod.GET, "/workshops").permitAll()
    //               .requestMatchers("/auth/**").permitAll()
    //               .requestMatchers("/admin/**").hasRole("ADMIN")
    //               .anyRequest().authenticated())
    //           .oauth2ResourceServer(oauth2 -> oauth2.jwt(
    //               jwt -> jwt.jwtAuthenticationConverter(jwtAuthenticationConverter)));
    //       return http.build();
    //   }

    @Bean
    public JwtEncoder jwtEncoder(@Value("${jwt.secret}") String secret) {
        return new NimbusJwtEncoder(new ImmutableSecret<>(hmacKey(secret)));
    }

    @Bean
    public JwtDecoder jwtDecoder(@Value("${jwt.secret}") String secret) {
        return NimbusJwtDecoder.withSecretKey(hmacKey(secret)).build();
    }

    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtGrantedAuthoritiesConverter authorities = new JwtGrantedAuthoritiesConverter();
        authorities.setAuthoritiesClaimName("roles");
        authorities.setAuthorityPrefix("ROLE_");
        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
        converter.setJwtGrantedAuthoritiesConverter(authorities);
        return converter;
    }

    private static SecretKey hmacKey(String secret) {
        return new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
    }
}
