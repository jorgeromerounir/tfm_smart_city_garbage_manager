CREATE TABLE IF NOT EXISTS containers (
    id VARCHAR(36) PRIMARY KEY,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    waste_level_value DOUBLE PRECISION NOT NULL,
    waste_level_status VARCHAR(50) NOT NULL,
    temperature DOUBLE PRECISION NOT NULL,
    address TEXT NOT NULL,
    city_id BIGINT NOT NULL,
    customer_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    zone_id VARCHAR(36) NULL
);

CREATE INDEX IF NOT EXISTS idx_containers_customer_id ON containers(customer_id);
