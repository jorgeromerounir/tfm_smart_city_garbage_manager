CREATE TABLE IF NOT EXISTS zones (
    id VARCHAR(36) PRIMARY KEY,
    center_latitude DOUBLE PRECISION NOT NULL,
    center_longitude DOUBLE PRECISION NOT NULL,
    name VARCHAR(255) NOT NULL,
    city_id BIGINT NOT NULL,
    customer_id BIGINT NOT NULL,
    start_lat DOUBLE PRECISION NOT NULL,
    start_lng DOUBLE PRECISION NOT NULL,
    end_lat DOUBLE PRECISION NOT NULL,
    end_lng DOUBLE PRECISION NOT NULL,
    description TEXT,
    color VARCHAR(7) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_zones_customer_id ON zones(customer_id);

-- Add foreign key constraint between containers.zone_id and zones.id
ALTER TABLE containers 
ADD CONSTRAINT fk_containers_zone_id 
FOREIGN KEY (zone_id) REFERENCES zones(id) 
ON DELETE SET NULL 
ON UPDATE CASCADE;

-- Add index for zone_id in containers table for better performance
CREATE INDEX IF NOT EXISTS idx_containers_zone_id ON containers(zone_id);
