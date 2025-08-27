CREATE TABLE IF NOT EXISTS books (
    isbn VARCHAR(255) PRIMARY KEY,
    title VARCHAR(255),
    author VARCHAR(255),
    gender VARCHAR(255),
    published_date DATE,
    creation_date_time TIMESTAMP,
    rating INTEGER,
    enabled BOOLEAN,
    price DECIMAL(19, 2),
    currency VARCHAR(255),
    stock INTEGER,
    description TEXT
);
