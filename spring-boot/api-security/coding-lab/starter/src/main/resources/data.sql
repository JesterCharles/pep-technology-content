-- Two customers' bookings. The payment references are fake internal values.
INSERT INTO booking (id, owner, workshop, seats, payment_reference) VALUES (1, 'grace', 'Spring Kickstart', 2, 'PAY-INTERNAL-1001');
INSERT INTO booking (id, owner, workshop, seats, payment_reference) VALUES (2, 'ada', 'REST Deep Dive', 1, 'PAY-INTERNAL-1002');
