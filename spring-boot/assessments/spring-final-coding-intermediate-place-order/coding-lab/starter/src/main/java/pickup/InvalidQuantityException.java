package pickup;

import org.springframework.http.HttpStatus;
import org.springframework.web.ErrorResponseException;

/**
 * Provided. Product.reserve throws it for a line quantity below 1. Spring
 * answers it by itself with a 400 problem detail titled "Invalid quantity".
 */
public class InvalidQuantityException extends ErrorResponseException {

    public InvalidQuantityException(String sku, int quantity) {
        super(HttpStatus.BAD_REQUEST);
        setTitle("Invalid quantity");
        setDetail("Quantity " + quantity + " of " + sku + " is not allowed; order at least 1");
    }
}
