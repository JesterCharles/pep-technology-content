package toolshed;

/** Provided. Throw it when no tool has the requested id. */
public class ToolNotFoundException extends RuntimeException {

    public ToolNotFoundException(long id) {
        super("No tool with id " + id);
    }
}
