import {
  closeConnection,
  declareExchange,
  sendMessage
} from './rabbitmq-client.js'
import fs from 'fs'

const EXCHANGE_NAME = 'container.updated.exchange'
const EXCHANGE_TYPE = 'topic'
const WASTE_LEVELS = ['light', 'medium', 'heavy']
const NUM_PROCESSES = 10
const INTERVAL_MS = 30_000 // 30 seconds

// Store interval IDs for cleanup
const intervalIds = new Set()

function startSimulatedDataProcess(processId) {
  console.log(`🚀 Starting sensor process ${processId}`)

  // Send initial data
  void sendSensorData(processId)
  const intervalId = scheduleDataSending(processId)
  intervalIds.add(intervalId)
}

function scheduleDataSending(processId) {
  return setInterval(
    () => {
      void sendSensorData(processId)
    },
    INTERVAL_MS + Math.random() * 10_000
  )
}

function generateContainerId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

// Load container IDs from JSON file
//const containerIds = Array.from({ length: 200 }, () => generateContainerId())
const containerData = JSON.parse(fs.readFileSync('./containers_id_list.json', 'utf8'))
const containerIds = containerData.container_ids

export async function sendSensorData(processId) {
  try {
    // Select a random container
    const containerId =
      containerIds[Math.floor(Math.random() * containerIds.length)]

    // Generate random sensor data
    const wasteLevel =
      WASTE_LEVELS[Math.floor(Math.random() * WASTE_LEVELS.length)]
    const temperature = Math.round((Math.random() * 40 + 10) * 100) / 100 // 10-50°C

    const sensorData = {
      containerId,
      wasteLevel,
      temperature
    }

    await sendMessage(EXCHANGE_NAME, EXCHANGE_NAME, sensorData)

    console.log(
      `🔄 Process ${processId}: 📦 Sent data for container ${containerId.slice(0, 8)} - ${wasteLevel} (🌡️ ${temperature}°C)`
    )
  } catch (error) {
    if (
      error.response?.status === 400 &&
      error.response?.data?.message === 'Container not found'
    ) {
      // Container doesn't exist in DB, this is expected for simulation
      console.log(
        `⚠️ Process ${processId}: Container not found (expected for simulation)`
      )
    } else {
      console.error(
        `❌ Process ${processId}: Error sending sensor data: ${error.message}`
      )
    }
  }
}

// Graceful shutdown handler
async function shutdown(signal) {
  console.log(`\n🛑 Received ${signal}, starting graceful shutdown...`)

  // Clear all intervals
  for (const intervalId of intervalIds) {
    clearInterval(intervalId)
  }
  intervalIds.clear()

  try {
    // Close RabbitMQ connection
    await closeConnection()
    console.log('✅ Successfully closed RabbitMQ connection')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error during shutdown:', error)
    process.exit(1)
  }
}

// Register shutdown handlers
process.on('SIGTERM', () => shutdown('SIGTERM'))
process.on('SIGINT', () => shutdown('SIGINT'))
process.on('uncaughtException', error => {
  console.error('🔥 Uncaught Exception:', error)
  void shutdown('uncaught exception')
})
process.on('unhandledRejection', (reason, promise) => {
  console.error('🔥 Unhandled Rejection at:', promise, 'reason:', reason)
  void shutdown('unhandled rejection')
})

// Start multiple sensor processes
console.log(`🎮 Starting ${NUM_PROCESSES} sensor simulation processes...`)
console.log(
  `⏱️ Each process will send data every ~${INTERVAL_MS / 1000} seconds`
)

await declareExchange(EXCHANGE_NAME, EXCHANGE_TYPE)

for (let i = 1; i <= NUM_PROCESSES; i++) {
  setTimeout(() => {
    startSimulatedDataProcess(i)
  }, i * 1000) // Stagger the start times
}

console.log('✨ Sensor simulator started. Press Ctrl+C to stop.')
