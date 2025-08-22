# Urban Waste Monitoring System (UWM)

An open-source system for monitoring urban waste container levels using IoT sensors, real-time visualization, and route optimization.

## Features

- **Real-time Monitoring**: Track waste container levels (light, medium, heavy)
- **Interactive Map**: OpenStreetMap integration with color-coded markers
- **Route Optimization**: A* algorithm for efficient waste collection routes
- **Multi-city Support**: Bogotá D.C. and Madrid configurations
- **Country-based Access**: Supervisors see containers only from their assigned country
- **Real-time Updates**: Socket.io for live status updates
- **Responsive Design**: Material Design 3 with accessibility support

## Architecture

```
uwm/
├── backend/          # NestJS API with SQLite
├── frontend/         # React + TypeScript + MUI
├── sensor-simulator/ # HTTP sensor simulation
├── auth-service/     # Spring Boot JWT Authentication
├── accounts-service/ # Spring Boot Account Management
└── docs/            # Documentation
```

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

**Option 1: Quick Start (Recommended)**
```bash
# Install all dependencies and start all services (including microservices)
./start.sh
```

**Option 2: Separate Terminals**
```bash
# Start each service in its own terminal
./start-services.sh
```

**If you encounter file watcher issues:**
```bash
# Use simple startup (manual terminals)
./start-simple.sh
```

**Option 2: Manual Setup**
```bash
# Install all dependencies
npm run install:all

# Start all services concurrently
npm run dev
```

**Option 3: Individual Services**
```bash
# Terminal 1: Backend
cd backend && npm install && npm run start:dev

# Terminal 2: Frontend  
cd frontend && npm install && npm run dev

# Terminal 3: Sensor Simulator
cd sensor-simulator && npm install && npm start
```

### User Country Association

After starting the services, create and associate users with countries:

```bash
# Create supervisor user with Colombia association
./create-supervisor.sh
```

**Default User Accounts:**
- `admin@uwm.com` / `admin123` (Admin) - Can see all cities
- `john.doe@uwm.com` / `supervisor123` (Supervisor) - Associated with Colombia (Bogotá D.C.)
- `jhon.doe@uwm.com` (Supervisor) - Existing user, password unknown

**Country Association Rules:**
- **Admins**: Can view and manage containers from all cities
- **Supervisors**: Can only view containers from their assigned country
- **Operators**: Can only view containers from their assigned country

## API Endpoints

### Core Services
- `POST /containers/data` - Receive sensor data
- `GET /containers` - Get all containers
- `GET /containers/status` - Get status summary
- `POST /routes/optimize` - Generate optimized route

### Authentication Service (Port 8081)
- `POST /auth/signin` - User sign in
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - User logout

### Accounts Service (Port 8082)
- `POST /accounts` - Create account (with country field)
- `GET /accounts` - Get all accounts
- `GET /accounts/{id}` - Get account by ID
- `PUT /accounts/{id}` - Update account (including country)
- `DELETE /accounts/{id}` - Delete account

### Container Filtering
- `GET /containers?city=Bogotá D.C., Colombia` - Get containers by city
- `GET /containers/status?city=Madrid, Spain` - Get status summary by city

## Contributing

1. Fork the repository
2. Create a feature branch
3. Follow TypeScript and ESLint conventions
4. Add tests for new features
5. Submit a pull request

## License

MIT License - Open Source