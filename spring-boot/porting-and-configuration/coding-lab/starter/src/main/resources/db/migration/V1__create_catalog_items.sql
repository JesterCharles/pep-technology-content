-- Applied by Flyway on startup. Do not edit an applied migration; add a new
-- versioned file instead (that is Task 6).
create table catalog_items (
    id          int primary key,
    name        varchar(100) not null,
    price_cents int not null
);
