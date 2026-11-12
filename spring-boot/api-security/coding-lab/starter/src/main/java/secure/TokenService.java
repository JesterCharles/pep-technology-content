package secure;

import java.util.List;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.stereotype.Service;

/**
 * You edit this file in Task 3. The injected JwtEncoder signs with the shared
 * HMAC key from SecurityConfig.
 */
@Service
public class TokenService {

    private final JwtEncoder encoder;

    public TokenService(JwtEncoder encoder) {
        this.encoder = encoder;
    }

    /**
     * Issues a signed JWT for a successful login.
     *
     * TODO Task 3: build and sign the token:
     *   Instant now = Instant.now();
     *   JwtClaimsSet claims = JwtClaimsSet.builder()
     *           .subject(username)
     *           .issuedAt(now)
     *           .expiresAt(now.plus(Duration.ofMinutes(15)))
     *           .claim("roles", roles)
     *           .build();
     *   JwsHeader header = JwsHeader.with(MacAlgorithm.HS256).build();
     *   return encoder.encode(JwtEncoderParameters.from(header, claims)).getTokenValue();
     * (imports: java.time.Duration, java.time.Instant,
     *  org.springframework.security.oauth2.jose.jws.MacAlgorithm,
     *  org.springframework.security.oauth2.jwt.JwsHeader,
     *  org.springframework.security.oauth2.jwt.JwtClaimsSet,
     *  org.springframework.security.oauth2.jwt.JwtEncoderParameters)
     */
    public String issue(String username, List<String> roles) {
        return null;
    }
}
