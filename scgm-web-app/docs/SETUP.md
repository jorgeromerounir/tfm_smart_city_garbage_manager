# Setup Guide

## Prerequisites

- Node.js 18 or higher
- npm or yarn package manager

## Installation

### 1. Clone and Setup

```bash
git clone <repository-url>
cd uwm
```

### 2. Backend Setup

```bash
cd backend
npm install
npm run start:dev
```

The backend will start on `http://localhost:3001` and automatically:
- Create SQLite database (`uwm.db`)
- Initialize 200 containers with random data
- Start scheduled status updates every 5 minutes

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will start on `http://localhost:3000`

### 4. Sensor Simulator

```bash
cd sensor-simulator
npm install
npm start
```

This starts 10 processes that simulate sensor data every 30 seconds.

## Features

### Dashboard
- Real-time container status overview
- Color-coded status cards
- Automatic updates via WebSocket

### Routes
- Interactive map with OpenStreetMap
- Route optimization using A* algorithm
- Multi-city support (Bogotá, Madrid)
- Waste type filtering
- Route saving functionality
- North compass indicator

### Real-time Updates
- WebSocket notifications for status changes
- Material Design notifications
- Live map updates

## Configuration

### Cities
Add new cities in `backend/src/routes/routes.service.ts`:

```typescript
const bounds = {
  'New City, Country': {
    minLat: 0, maxLat: 1,
    minLng: 0, maxLng: 1,
  },
};
```

### Container Initialization
Modify container count in `backend/src/containers/containers.service.ts`:

```typescript
for (let i = 0; i < 200; i++) { // Change this number
```

## Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## Production Deployment

### Backend
```bash
cd backend
npm run build
npm run start:prod
```

### Frontend
```bash
cd frontend
npm run build
# Serve the dist folder with your web server
```

## Troubleshooting

### Common Issues

1. **Port conflicts**: Change ports in configuration files
2. **Database issues**: Delete `uwm.db` to reset
3. **CORS errors**: Check frontend/backend URLs match
4. **Map not loading**: Verify internet connection for tiles

### Logs
- Backend: Console output shows container updates
- Frontend: Browser console for errors
- Simulator: Process output shows data transmission