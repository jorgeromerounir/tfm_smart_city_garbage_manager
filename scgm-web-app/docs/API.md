# API Documentation

## Base URL
```
http://localhost:3001
```

## Endpoints

### Containers

#### POST /containers/data
Receive sensor data from IoT devices.

**Request Body:**
```json
{
  "containerId": "uuid",
  "wasteLevel": "light|medium|heavy",
  "temperature": 25.5
}
```

**Response:**
```json
{
  "success": true,
  "container": {
    "id": "uuid",
    "latitude": 4.7110,
    "longitude": -74.0721,
    "wasteLevel": "medium",
    "temperature": 25.5,
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

#### GET /containers
Get all containers.

**Response:**
```json
[
  {
    "id": "uuid",
    "latitude": 4.7110,
    "longitude": -74.0721,
    "wasteLevel": "medium",
    "temperature": 25.5,
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
]
```

#### GET /containers/status
Get container status summary.

**Response:**
```json
{
  "light": 120,
  "medium": 50,
  "heavy": 30,
  "total": 200
}
```

### Routes

#### POST /routes/optimize
Generate optimized collection route.

**Request Body:**
```json
{
  "startLat": 4.7110,
  "startLng": -74.0721,
  "endLat": 4.7200,
  "endLng": -74.0800,
  "city": "Bogotá D.C., Colombia",
  "wasteTypes": ["medium", "heavy"]
}
```

**Response:**
```json
{
  "route": [
    {"lat": 4.7110, "lng": -74.0721},
    {"lat": 4.7150, "lng": -74.0750, "id": "container-uuid"},
    {"lat": 4.7200, "lng": -74.0800}
  ],
  "totalDistance": 15.2,
  "containerCount": 25,
  "estimatedTime": 45
}
```

## WebSocket Events

### containerStatusUpdate
Emitted when a container's status changes.

**Payload:**
```json
{
  "id": "uuid",
  "wasteLevel": "heavy",
  "temperature": 28.5,
  "latitude": 4.7110,
  "longitude": -74.0721,
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

### routeUpdate
Emitted when route optimization completes.

**Payload:**
```json
{
  "route": [...],
  "totalDistance": 15.2,
  "containerCount": 25,
  "estimatedTime": 45
}
```