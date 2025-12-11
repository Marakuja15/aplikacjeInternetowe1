CREATE TABLE category
(
    id          INTEGER NOT NULL
        CONSTRAINT category_pk
            PRIMARY KEY AUTOINCREMENT,
    name        TEXT    NOT NULL,
    description TEXT    NOT NULL
);
