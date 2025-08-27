INSERT INTO cities (id, name, country, latitude, longitude, active, created_at, updated_at) VALUES
(1, 'Bogotá', 'CO', 4.7110, -74.0721, TRUE, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP()),
(2, 'Medellín', 'CO', 6.2442, -75.5812, TRUE, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP()),
(3, 'Cali', 'CO', 3.4516, -76.5320, TRUE, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP()),
(4, 'Barranquilla', 'CO', 10.9685, -74.7813, TRUE, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP()),
(5, 'Cartagena', 'CO', 10.3910, -75.4794, TRUE, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());

INSERT INTO cities (id, name, country, latitude, longitude, active, created_at, updated_at) VALUES
(6, 'Madrid', 'ES', 40.4168, -3.7038, TRUE, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP()),
(7, 'Barcelona', 'ES', 41.3851, 2.1734, TRUE, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP()),
(8, 'Valencia', 'ES', 39.4699, -0.3763, TRUE, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP()),
(9, 'Sevilla', 'ES', 37.3891, -5.9845, TRUE, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP()),
(10, 'Bilbao', 'ES', 43.2630, -2.9349, TRUE, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());

INSERT INTO customers (id, name, description, city_id, created_at, updated_at, active) VALUES
(1, 'Ana Basuras SAS', 'Cliente de ejemplo 1', 1, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP(), TRUE),
(2, 'City Basuras', 'Cliente de ejemplo 2', 6, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP(), TRUE);

