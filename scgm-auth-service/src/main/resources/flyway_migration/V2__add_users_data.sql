--- Default user 1
INSERT INTO public.users
(id, email, "password", claims)
VALUES(1, 'admin@scgm.com', '$2a$10$Iohg72CMsknj5pr3O8fgeeFqzcRDxqqsBxnguy/TSUNKW7wFD3bUi', '{"customerId":"1","profile":"ADMIN","updatedAt":"2025-09-17T23:03:01.161167700Z","userId":"1"}');
--- Default user 2
INSERT INTO public.users
(id, email, "password", claims)
VALUES(2, 'supervisor@scgm.com', '$2a$10$E92OxvCffte4lwzKpHV7oOb5dHCETbRhyaJbdjtLMtgbu.lrUGd0W', '{"customerId":"1","profile":"SUPERVISOR","updatedAt":"2025-09-17T23:04:40.193149800Z","userId":"2"}');
--- Default user 3
INSERT INTO public.users
(id, email, "password", claims)
VALUES(3, 'operator@scgm.com', '$2a$10$T9wZbBxmWe/7gT9P9O0W5.WbaaD19pNJ/OrDKKsSjlclB7riB4Pra', '{"customerId":"1","profile":"OPERATOR","updatedAt":"2025-09-17T23:06:29.997415600Z","userId":"3"}');
