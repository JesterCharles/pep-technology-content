package pickup;

import org.springframework.http.HttpStatus;
import org.springframework.web.ErrorResponseException;

/**
 * Provided. Throw it when an order line names an unknown SKU. Spring answers
 * it by itself with a 404 problem detail titled "Product not found".
 */
public class ProductNotFoundException extends ErrorResponseException {

    public ProductNotFoundException(String sku) {
        super(HttpStatus.NOT_FOUND);
        setTitle("Product not found");
        setDetail("No product with SKU " + sku);
    }
}
