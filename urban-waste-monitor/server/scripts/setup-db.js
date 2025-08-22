const pool = require('../config/database');

async function setupDatabase() {
  try {
    console.log('Setting up database...');
    
    // Create containers table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS containers (
        id VARCHAR(50) PRIMARY KEY,
        waste_level VARCHAR(10) NOT NULL CHECK (waste_level IN ('light', 'medium', 'heavy')),
        battery_level INTEGER CHECK (battery_level >= 0 AND battery_level <= 100),
        temperature DECIMAL(5,2),
        latitude DECIMAL(10,8),
        longitude DECIMAL(11,8),
        address TEXT,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create sensor readings table for historical data
    await pool.query(`
      CREATE TABLE IF NOT EXISTS sensor_readings (
        id SERIAL PRIMARY KEY,
        container_id VARCHAR(50) REFERENCES containers(id),
        waste_level VARCHAR(10) NOT NULL,
        battery_level INTEGER,
        temperature DECIMAL(5,2),
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create indexes for better performance
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_containers_waste_level ON containers(waste_level);
    `);
    
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_containers_location ON containers(latitude, longitude);
    `);
    
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_sensor_readings_container_timestamp 
      ON sensor_readings(container_id, timestamp);
    `);
    
    // Generate 100 containers with random locations around Madrid
    const sampleContainers = [];
    const levels = ['light', 'medium', 'heavy'];
    const streets = ['Calle', 'Avenida', 'Plaza', 'Paseo', 'Gran Vía'];
    const areas = ['Centro', 'Retiro', 'Salamanca', 'Chamberí', 'Malasaña', 'Chueca', 'La Latina'];
    
    for (let i = 1; i <= 100; i++) {
      const lat = 40.4168 + (Math.random() - 0.5) * 0.02;
      const lon = -3.7038 + (Math.random() - 0.5) * 0.02;
      const level = levels[Math.floor(Math.random() * levels.length)];
      const street = streets[Math.floor(Math.random() * streets.length)];
      const area = areas[Math.floor(Math.random() * areas.length)];
      
      sampleContainers.push({
        id: `CNT${i.toString().padStart(3, '0')}`,
        lat: Math.round(lat * 10000) / 10000,
        lon: Math.round(lon * 10000) / 10000,
        address: `${street} ${Math.floor(Math.random() * 200) + 1}, ${area}, Madrid`,
        level
      });
    }
    
    for (const container of sampleContainers) {
      await pool.query(`
        INSERT INTO containers (id, waste_level, battery_level, temperature, latitude, longitude, address)
        VALUES ($1, $2, $3, 22.5, $4, $5, $6)
        ON CONFLICT (id) DO NOTHING
      `, [container.id, container.level, Math.floor(Math.random() * 40) + 60, container.lat, container.lon, container.address]);
    }
    
    console.log('Database setup completed successfully!');
    console.log(`Created ${sampleContainers.length} sample containers with varied waste levels`);
    
  } catch (err) {
    console.error('Database setup error:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

setupDatabase();