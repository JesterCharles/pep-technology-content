package workshops;

import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * The main application class. You edit it in Tasks 5 and 7.
 */
// TODO Task 5: component scanning starts in this class's package, so it never finds
// AboutController in the about package. Make Spring scan both packages.
@SpringBootApplication
public class WorkshopsApplication {

    public static void main(String[] args) {
        // TODO Task 7: start Spring Boot from here, the way a generated project's main class does.
    }
}
