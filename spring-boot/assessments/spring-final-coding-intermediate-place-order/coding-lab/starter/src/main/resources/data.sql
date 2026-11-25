INSERT INTO product (sku, name, stock) VALUES ('PEN-BLK', 'Black gel pen',    50);
INSERT INTO product (sku, name, stock) VALUES ('NB-A5',   'A5 notebook',      10);
INSERT INTO product (sku, name, stock) VALUES ('USB-32',  '32 GB USB stick',   2);

INSERT INTO pickup_order (customer) VALUES ('ana');

INSERT INTO order_line (order_id, sku, quantity) VALUES (1, 'PEN-BLK', 5);
INSERT INTO order_line (order_id, sku, quantity) VALUES (1, 'NB-A5',   1);
