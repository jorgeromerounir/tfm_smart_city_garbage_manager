ALTER TABLE accounts ADD COLUMN country VARCHAR(255);

-- Update existing accounts with default countries
UPDATE accounts SET country = 'Colombia' WHERE email = 'john.doe@uwm.com';
UPDATE accounts SET country = 'Spain' WHERE email = 'admin@uwm.com';