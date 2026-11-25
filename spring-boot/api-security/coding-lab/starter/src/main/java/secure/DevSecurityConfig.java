package secure;

import java.util.List;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

/**
 * You edit this file in Tasks 5 and 6. The imports both tasks need are
 * already at the top; everything else is yours to write.
 *
 * TODO Task 5: make this a configuration class that exists only in the dev
 * profile, with one SecurityFilterChain bean that permits every request.
 *
 * TODO Task 6: add the CORS configuration bean for the local front end and
 * turn CORS on in the dev chain.
 */
public class DevSecurityConfig {
}
