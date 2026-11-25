package toolshed;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** You add one method: GET /api/tools/{id}. It calls ToolService and returns a ToolResponse. */
@RestController
@RequestMapping("/api/tools")
public class ToolController {

    private final ToolService service;

    public ToolController(ToolService service) {
        this.service = service;
    }

    // TODO: GET /api/tools/{id}
}
