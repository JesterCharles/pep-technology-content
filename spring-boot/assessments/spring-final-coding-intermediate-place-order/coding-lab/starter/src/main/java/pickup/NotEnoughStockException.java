package pickup;

import org.springframework.http.HttpStatus;
import org.springframework.web.ErrorResponseException;

/**
 * Provided. Product.reserve throws it when the shelf holds fewer items than a
 * line asks for. Spring answers it by itself with a 409 problem detail titled
 * "Not enough stock".
 */
public class NotEnoughStockException extends ErrorResponseException {

    public NotEnoughStockException(String sku, int wanted, int available) {
        super(HttpStatus.CONFLICT);
        setTitle("Not enough stock");
        setDetail("Only " + available + " of " + sku + " left, " + wanted + " requested");
    }
}
