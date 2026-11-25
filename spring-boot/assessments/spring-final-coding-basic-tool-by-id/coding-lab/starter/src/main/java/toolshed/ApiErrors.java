package toolshed;

import org.springframework.web.bind.annotation.RestControllerAdvice;

/** You add one handler: the place that turns ToolNotFoundException into a problem detail. */
@RestControllerAdvice
public class ApiErrors {

    // TODO: ToolNotFoundException -> 404 ProblemDetail, title "Tool not found", detail = the exception's message
}
