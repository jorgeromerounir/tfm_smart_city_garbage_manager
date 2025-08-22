const express = require('express');
const pool = require('../config/database');

const router = express.Router();

// Get all containers
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, waste_level, battery_level, temperature, latitude, longitude, 
             address, last_updated, created_at
      FROM containers 
      ORDER BY last_updated DESC
    `);
    
    res.json(result.rows);
  } catch (err) {
    console.error('Get containers error:', err);
    res.status(500).json({ error: 'Failed to fetch containers' });
  }
});

// Get specific container
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(`
      SELECT id, waste_level, battery_level, temperature, latitude, longitude,
             address, last_updated, created_at
      FROM containers 
      WHERE id = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Container not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Get container error:', err);
    res.status(500).json({ error: 'Failed to fetch container' });
  }
});

// Get container history
router.get('/:id/history', async (req, res) => {
  try {
    const { id } = req.params;
    const { hours = 24 } = req.query;
    
    const result = await pool.query(`
      SELECT waste_level, battery_level, temperature, timestamp
      FROM sensor_readings 
      WHERE container_id = $1 
        AND timestamp > NOW() - INTERVAL '${hours} hours'
      ORDER BY timestamp DESC
      LIMIT 1000
    `, [id]);
    
    res.json(result.rows);
  } catch (err) {
    console.error('Get history error:', err);
    res.status(500).json({ error: 'Failed to fetch container history' });
  }
});

module.exports = router;