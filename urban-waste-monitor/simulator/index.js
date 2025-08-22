const axios = require('axios');
const { program } = require('commander');

program
  .option('-n, --containers <number>', 'Number of containers to simulate', '5')
  .option('-i, --interval <seconds>', 'Update interval in seconds', '30')
  .option('-u, --url <url>', 'Backend URL', 'http://localhost:3001')
  .parse();

const options = program.opts();
const CONTAINER_COUNT = parseInt(options.containers);
const UPDATE_INTERVAL = parseInt(options.interval) * 1000;
const BACKEND_URL = options.url;

class WasteSensorSimulator {
  constructor(containerId) {
    this.containerId = containerId;
    this.wasteLevel = 'light';
    this.batteryLevel = 100;
    this.temperature = 20 + Math.random() * 10; // 20-30°C
    this.fillRate = Math.random() * 0.1 + 0.05; // Random fill rate
  }

  generateReading() {
    // Simulate waste accumulation
    const random = Math.random();
    
    if (random < 0.7) {
      // 70% chance to increase waste level
      if (this.wasteLevel === 'light' && Math.random() < this.fillRate) {
        this.wasteLevel = 'medium';
      } else if (this.wasteLevel === 'medium' && Math.random() < this.fillRate * 0.5) {
        this.wasteLevel = 'heavy';
      }
    } else if (random < 0.8) {
      // 10% chance to empty (collection occurred)
      this.wasteLevel = 'light';
      console.log(`📦 Container ${this.containerId} was emptied`);
    }
    
    // Simulate battery drain
    this.batteryLevel = Math.max(0, this.batteryLevel - Math.random() * 0.5);
    
    // Simulate temperature variation
    this.temperature += (Math.random() - 0.5) * 2;
    this.temperature = Math.max(0, Math.min(50, this.temperature));
    
    return {
      containerId: this.containerId,
      wasteLevel: this.wasteLevel,
      batteryLevel: Math.round(this.batteryLevel),
      temperature: Math.round(this.temperature * 10) / 10,
      timestamp: new Date().toISOString()
    };
  }

  async sendReading() {
    try {
      const reading = this.generateReading();
      
      const response = await axios.post(`${BACKEND_URL}/api/sensors/data`, reading, {
        timeout: 5000,
        headers: { 'Content-Type': 'application/json' }
      });
      
      const levelEmoji = {
        light: '🟢',
        medium: '🟡', 
        heavy: '🔴'
      };
      
      console.log(`${levelEmoji[reading.wasteLevel]} ${reading.containerId}: ${reading.wasteLevel} (${reading.batteryLevel}% battery)`);
      
    } catch (error) {
      console.error(`❌ Failed to send data for ${this.containerId}:`, error.message);
    }
  }

  start() {
    console.log(`🚀 Starting sensor ${this.containerId}`);
    
    // Send initial reading
    this.sendReading();
    
    // Schedule periodic readings
    setInterval(() => {
      this.sendReading();
    }, UPDATE_INTERVAL);
  }
}

async function main() {
  console.log(`🏭 Starting Waste Sensor Simulator`);
  console.log(`📊 Containers: ${CONTAINER_COUNT}`);
  console.log(`⏱️  Update interval: ${UPDATE_INTERVAL/1000}s`);
  console.log(`🌐 Backend URL: ${BACKEND_URL}`);
  console.log('─'.repeat(50));
  
  // Test backend connectivity
  try {
    await axios.get(`${BACKEND_URL}/health`, { timeout: 5000 });
    console.log('✅ Backend connection successful');
  } catch (error) {
    console.error('❌ Cannot connect to backend:', error.message);
    console.log('Make sure the backend server is running');
    process.exit(1);
  }
  
  // Create and start simulators
  const simulators = [];
  for (let i = 1; i <= CONTAINER_COUNT; i++) {
    const containerId = `CNT${i.toString().padStart(3, '0')}`;
    const simulator = new WasteSensorSimulator(containerId);
    simulators.push(simulator);
    
    // Stagger startup to avoid overwhelming the server
    setTimeout(() => simulator.start(), i * 1000);
  }
  
  // Graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down simulators...');
    process.exit(0);
  });
}

main().catch(console.error);