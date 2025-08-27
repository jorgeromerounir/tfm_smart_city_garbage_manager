CREATE TABLE IF NOT EXISTS cities (
    id BIGINT PRIMARY KEY,
    name VARCHAR(255),
    country VARCHAR(2),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    active BOOLEAN,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS customers (
    id BIGINT PRIMARY KEY,
    name VARCHAR(200),
    description TEXT,
    city_id BIGINT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    active BOOLEAN,
    FOREIGN KEY (city_id) REFERENCES cities(id)
);
