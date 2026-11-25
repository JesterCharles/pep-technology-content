package secure;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
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
     * (the six imports this needs are already at the top of this file)
     */
    public String issue(String username, List<String> roles) {
        return null;
    }
}
