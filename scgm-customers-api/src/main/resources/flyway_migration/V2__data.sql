INSERT INTO cities (name, country, latitude, longitude, active, created_at, updated_at) VALUES
('Bogotá', 'CO', 4.7110, -74.0721, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Medellín', 'CO', 6.2442, -75.5812, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Cali', 'CO', 3.4516, -76.5320, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Barranquilla', 'CO', 10.9685, -74.7813, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Cartagena', 'CO', 10.3910, -75.4794, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Madrid', 'ES', 40.4168, -3.7038, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Barcelona', 'ES', 41.3851, 2.1734, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Valencia', 'ES', 39.4699, -0.3763, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Sevilla', 'ES', 37.3891, -5.9845, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Bilbao', 'ES', 43.2630, -2.9349, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO customers (name, description, city_id, created_at, updated_at, active) VALUES
('Admin Customer', 'Admin Customer', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, TRUE),
('City Basuras', 'Cliente de ejemplo 2', 6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, TRUE);

--- Default user 1
INSERT INTO public.users
("name", email, profile, customer_id, created_at, updated_at, "password")
VALUES('Default Admin', 'admin@scgm.com', 'ADMIN', 1, '2025-09-17 23:03:01.161', '2025-09-17 23:03:01.161', '$2a$10$Iohg72CMsknj5pr3O8fgeeFqzcRDxqqsBxnguy/TSUNKW7wFD3bUi');
--- Default user 2
INSERT INTO public.users
("name", email, profile, customer_id, created_at, updated_at, "password")
VALUES('Default Supervisor', 'supervisor@scgm.com', 'SUPERVISOR', 1, '2025-09-17 23:04:40.193', '2025-09-17 23:04:40.193', '$2a$10$E92OxvCffte4lwzKpHV7oOb5dHCETbRhyaJbdjtLMtgbu.lrUGd0W');
--- Default user 3
INSERT INTO public.users
("name", email, profile, customer_id, created_at, updated_at, "password")
VALUES('Default Operator', 'operator@scgm.com', 'OPERATOR', 1, '2025-09-17 23:06:29.997', '2025-09-17 23:06:29.997', '$2a$10$T9wZbBxmWe/7gT9P9O0W5.WbaaD19pNJ/OrDKKsSjlclB7riB4Pra');
