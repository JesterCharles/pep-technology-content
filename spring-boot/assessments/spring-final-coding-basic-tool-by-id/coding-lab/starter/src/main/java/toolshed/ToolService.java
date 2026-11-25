package toolshed;

import org.springframework.stereotype.Service;

/** You edit byId. Keep its signature; the tests call it. */
@Service
public class ToolService {

    private final ToolRepository tools;

    public ToolService(ToolRepository tools) {
        this.tools = tools;
    }

    /** The tool with this id, or ToolNotFoundException. */
    public Tool byId(long id) {
        throw new UnsupportedOperationException("TODO: ToolService.byId");
    }
}
