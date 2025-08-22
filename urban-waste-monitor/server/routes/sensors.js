const express = require('express');
const Joi = require('joi');
const pool = require('../config/database');

const router = express.Router();

// Validation schema
const sensorDataSchema = Joi.object({
  containerId: Joi.string().required(),
  wasteLevel: Joi.string().valid('light', 'medium', 'heavy').required(),
  batteryLevel: Joi.number().min(0).max(100),
  temperature: Joi.number(),
  timestamp: Joi.date().iso()
});

// Receive sensor data
router.post('/data', async (req, res) => {
  try {
    const { error, value } = sensorDataSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { containerId, wasteLevel, batteryLevel, temperature } = value;
    const timestamp = new Date();

    // Update container status
    await pool.query(`
      INSERT INTO containers (id, waste_level, battery_level, temperature, last_updated)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (id) 
      DO UPDATE SET 
        waste_level = $2,
        battery_level = $3,
        temperature = $4,
        last_updated = $5
    `, [containerId, wasteLevel, batteryLevel, temperature, timestamp]);

    // Store historical data
    await pool.query(`
      INSERT INTO sensor_readings (container_id, waste_level, battery_level, temperature, timestamp)
      VALUES ($1, $2, $3, $4, $5)
    `, [containerId, wasteLevel, batteryLevel, temperature, timestamp]);

    res.json({ success: true, timestamp });
  } catch (err) {
    console.error('Sensor data error:', err);
    res.status(500).json({ error: 'Failed to process sensor data' });
  }
});

module.exports = router;