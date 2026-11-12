package secure;

import java.util.HashMap;
import java.util.Map;
import org.springframework.stereotype.Service;

/**
 * You edit this file in Task 1: it currently stores and compares raw
 * passwords, which the password-hashing topic forbids.
 *
 * TODO Task 1: inject the PasswordEncoder bean through the constructor (a
 * final field and a constructor parameter), store
 * encoder.encode(rawPassword) in register, and compare with
 * encoder.matches(rawPassword, stored) in matches.
 */
@Service
public class UserAccountService {

    private final Map<String, String> accounts = new HashMap<>();

    public UserAccountService() {
        // The development admin account; its password is a disposable dev value.
        register("admin", "admin-dev-password");
    }

    public void register(String username, String rawPassword) {
        accounts.put(username, rawPassword);
    }

    public boolean matches(String username, String rawPassword) {
        String stored = accounts.get(username);
        return stored != null && stored.equals(rawPassword);
    }

    /** What is actually stored for a user; the tests inspect it. */
    public String storedPassword(String username) {
        return accounts.get(username);
    }
}
