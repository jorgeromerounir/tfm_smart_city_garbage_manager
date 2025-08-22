const request = require('supertest');
const { app } = require('../index');

describe('Sensor API', () => {
  describe('POST /api/sensors/data', () => {
    it('should accept valid sensor data', async () => {
      const sensorData = {
        containerId: 'TEST001',
        wasteLevel: 'medium',
        batteryLevel: 85,
        temperature: 22.5
      };

      const response = await request(app)
        .post('/api/sensors/data')
        .send(sensorData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.timestamp).toBeDefined();
    });

    it('should reject invalid waste level', async () => {
      const sensorData = {
        containerId: 'TEST001',
        wasteLevel: 'invalid',
        batteryLevel: 85,
        temperature: 22.5
      };

      await request(app)
        .post('/api/sensors/data')
        .send(sensorData)
        .expect(400);
    });

    it('should reject missing containerId', async () => {
      const sensorData = {
        wasteLevel: 'medium',
        batteryLevel: 85,
        temperature: 22.5
      };

      await request(app)
        .post('/api/sensors/data')
        .send(sensorData)
        .expect(400);
    });

    it('should reject invalid battery level', async () => {
      const sensorData = {
        containerId: 'TEST001',
        wasteLevel: 'medium',
        batteryLevel: 150,
        temperature: 22.5
      };

      await request(app)
        .post('/api/sensors/data')
        .send(sensorData)
        .expect(400);
    });
  });
});