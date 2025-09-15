# Urban Waste Monitoring System (UWM)

An open-source system for monitoring urban waste container levels using IoT sensors, real-time visualization, and route optimization.

## Features

- **Real-time Monitoring**: Track waste container levels (light, medium, heavy)
- **Interactive Map**: OpenStreetMap integration with color-coded markers
- **Route Optimization**: Sweep + Dijkstra algorithm for Vehicle Routing Problem (VRP)
- **Multi-truck Support**: Automatic route partitioning across available trucks
- **Route Assignment**: Supervisors can assign routes to operators with specific trucks
- **Export Integration**: Operators can export routes to Google Maps and Waze
- **Multi-city Support**: Bogotá D.C. and Madrid configurations
- **Country-based Access**: Supervisors see containers only from their assigned country
- **Real-time Updates**: Socket.io for live status updates
- **Responsive Design**: Material Design 3 with accessibility support

## Architecture

https://memgraph.com/blog/use-cases-of-the-shortest-path-algorithm

```
uwm/
├── backend/          # NestJS API with SQLite and Dijkstra's + Sweep algorithm
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

**Create sample trucks:**
```bash
# Add sample trucks to the database
./create-trucks.sh
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

**User Role Capabilities:**
- **Admins**: Can view and manage containers from all cities, create routes
- **Supervisors**: Can view containers from assigned country, create and assign routes to operators
- **Operators**: Can view assigned routes, update route status, export to Google Maps/Waze

## API Endpoints

### Core Services
- `POST /containers/data` - Receive sensor data
- `GET /containers` - Get all containers
- `GET /containers/status` - Get status summary
- `POST /routes/optimize` - Generate optimized VRP routes
- `POST /routes/assign` - Assign route to operator
- `GET /routes/assignments` - Get route assignments
- `GET /routes/trucks` - Get available trucks
- `POST /routes/trucks` - Create new truck

### Authentication Service (Port 8081)
- `POST /api/v1/auth/signin` - User sign in
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/logout` - User logout

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
