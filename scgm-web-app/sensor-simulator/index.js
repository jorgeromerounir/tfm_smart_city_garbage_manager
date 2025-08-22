const axios = require('axios');

const API_BASE = 'http://localhost:3001';
const WASTE_LEVELS = ['light', 'medium', 'heavy'];
const NUM_PROCESSES = 10;
const INTERVAL_MS = 30000; // 30 seconds

// Generate random container IDs (UUIDs)
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Generate container IDs for simulation
const containerIds = Array.from({ length: 200 }, () => generateUUID());

const sendSensorData = async (processId) => {
  try {
    // Select random container
    const containerId = containerIds[Math.floor(Math.random() * containerIds.length)];
    
    // Generate random sensor data
    const wasteLevel = WASTE_LEVELS[Math.floor(Math.random() * WASTE_LEVELS.length)];
    const temperature = Math.round((Math.random() * 40 + 10) * 100) / 100; // 10-50°C
    
    const sensorData = {
      containerId,
      wasteLevel,
      temperature,
    };

    const response = await axios.post(`${API_BASE}/containers/data`, sensorData);
    
    console.log(`Process ${processId}: Sent data for container ${containerId.slice(0, 8)} - ${wasteLevel} (${temperature}°C)`);
    
  } catch (error) {
    if (error.response?.status === 400 && error.response?.data?.message === 'Container not found') {
      // Container doesn't exist in DB, this is expected for simulation
      console.log(`Process ${processId}: Container not found (expected for simulation)`);
    } else {
      console.error(`Process ${processId}: Error sending sensor data:`, error.message);
    }
  }
};

const startSensorProcess = (processId) => {
  console.log(`Starting sensor process ${processId}`);
  
  // Send initial data
  sendSensorData(processId);
  
  // Set up interval for continuous data sending
  setInterval(() => {
    sendSensorData(processId);
  }, INTERVAL_MS + Math.random() * 10000); // Add some randomness
};

// Start multiple sensor processes
console.log(`Starting ${NUM_PROCESSES} sensor simulation processes...`);
console.log(`Each process will send data every ~${INTERVAL_MS/1000} seconds`);
console.log(`Backend API: ${API_BASE}`);

for (let i = 1; i <= NUM_PROCESSES; i++) {
  setTimeout(() => {
    startSensorProcess(i);
  }, i * 1000); // Stagger the start times
}

console.log('Sensor simulator started. Press Ctrl+C to stop.');