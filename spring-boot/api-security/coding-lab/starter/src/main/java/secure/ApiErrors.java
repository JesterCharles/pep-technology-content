package secure;

import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * You edit this file in Task 7.
 *
 * TODO Task 7 step 4: a missing booking currently escapes as a 500. Turn a
 * NoSuchElementException into a 404 problem body with the title
 * "Booking not found" and a fixed detail of your own wording (global error
 * handling and ProblemDetail pages). The detail must not repeat the exception
 * message, the owner or any internal field.
 */
@RestControllerAdvice
public class ApiErrors {
}
