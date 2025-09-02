CREATE TABLE IF NOT EXISTS containers (
    id VARCHAR(36) PRIMARY KEY,
    latitude DECIMAL(11, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    waste_level_value DOUBLE NOT NULL,
    waste_level_status VARCHAR(50) NOT NULL,
    temperature DOUBLE NOT NULL,
    address TEXT NOT NULL,
    city_id BIGINT NOT NULL,
    customer_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);
