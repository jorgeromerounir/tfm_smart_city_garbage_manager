# Urban Waste Monitor

An Open Source system for monitoring urban waste container levels using IoT sensors and real-time visualization.

## Features

- Real-time waste level monitoring (light, medium, heavy)
- Interactive OpenStreetMap visualization
- Route optimization for waste collection
- Scalable sensor simulation
- RESTful API with PostgreSQL backend
- Accessible React frontend with Material-UI

## Quick Start

```bash
# Install dependencies
npm install
cd server && npm install
cd ../client && npm install
cd ../simulator && npm install

# Start PostgreSQL database
npm run db:start

# Setup database tables and sample data
npm run db:setup

# Start all services
npm run dev
```

## Architecture

- **Backend**: Node.js/Express with PostgreSQL
- **Frontend**: React with Material-UI and Leaflet
- **Simulator**: Node.js processes simulating IoT sensors
- **Database**: PostgreSQL with spatial extensions

## API Endpoints

- `POST /api/sensors/data` - Receive sensor data
- `GET /api/containers` - Get all container statuses
- `GET /api/containers/:id` - Get specific container
- `GET /api/routes/optimize` - Get optimized collection route

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Submit a pull request

## License

MIT License - see LICENSE file for details