import amqp from 'amqplib'

/**
 * Configuration for RabbitMQ connection
 * @type {Object}
 */
const config = {
  url: 'amqp://admin:admin123@localhost:5672',
  reconnectTimeout: 5000
}

let connection = null
let channel = null

/**
 * Creates a connection to RabbitMQ
 * @returns {Promise<void>}
 */
async function connect() {
  try {
    connection = await amqp.connect(config.url)
    console.log('🔌 Connected to RabbitMQ')

    connection.on('error', err => {
      console.error('🔥 RabbitMQ connection error:', err)
      setTimeout(connect, config.reconnectTimeout)
    })

    connection.on('close', () => {
      console.log('📴 RabbitMQ connection closed')
      setTimeout(connect, config.reconnectTimeout)
    })

    channel = await connection.createConfirmChannel()
    console.log('📢 Channel created')

    channel.on('error', err => {
      console.error('🔥 Channel error:', err)
    })

    channel.on('close', () => {
      console.log('🔇 Channel closed')
    })
  } catch (error) {
    console.error('🔥 Failed to connect to RabbitMQ:', error)
    setTimeout(connect, config.reconnectTimeout)
  }
}

/**
 * Creates an exchange if it doesn't exist
 * @param {string} exchangeName - Exchange name
 * @param {string} exchangeType - Exchange type
 * @returns {Promise<void>}
 */
export async function declareExchange(exchangeName, exchangeType) {
  try {
    if (!channel) {
      await connect()
    }
    await channel.assertExchange(exchangeName, exchangeType, {
      durable: true
    })
  } catch (error) {
    console.error(`❌ Error declaring exchange ${exchangeName}:`, error)
    throw error
  }
}

/**
 * Sends a message to RabbitMQ
 * @param {string} exchange - Exchange name
 * @param {string} routingKey - Routing key
 * @param {string|Object} message - Message to send
 * @returns {Promise<void>}
 */
export async function sendMessage(exchange, routingKey, message) {
  try {
    if (!channel) {
      await connect()
    }

    const messageBuffer = Buffer.from(
      typeof message === 'string' ? message : JSON.stringify(message)
    )

    await channel.publish(exchange, routingKey, messageBuffer)
    console.log(
      `📨 Message sent to ${exchange} (${routingKey}):`,
      typeof message === 'object' ? JSON.stringify(message) : message
    )
  } catch (error) {
    console.error('🔥 Failed to send message:', error)
    throw error
  }
}

/**
 * Gracefully closes the RabbitMQ connection
 * @returns {Promise<void>}
 */
export async function closeConnection() {
  try {
    if (channel) {
      await channel.close()
    }
    if (connection) {
      await connection.close()
    }
    console.log('👋 RabbitMQ connection closed gracefully')
  } catch (error) {
    console.error('🔥 Error closing RabbitMQ connection:', error)
    throw error
  }
}

// Initialize connection
connect().catch(error => {
  console.error('🔥 Initial connection failed:', error)
})
