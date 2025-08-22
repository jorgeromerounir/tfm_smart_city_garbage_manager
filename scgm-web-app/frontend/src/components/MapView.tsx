import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { Icon, LatLngExpression } from 'leaflet';
import { Box, Typography, Chip } from '@mui/material';
import { Container, WasteLevel, RoutePoint } from '../types';

interface MapViewProps {
  containers: Container[];
  route?: RoutePoint[];
  center: [number, number];
  zoom?: number;
}

const createIcon = (level: WasteLevel) => {
  const colors = {
    [WasteLevel.LIGHT]: '#4CAF50',
    [WasteLevel.MEDIUM]: '#FF9800',
    [WasteLevel.HEAVY]: '#F44336',
  };

  return new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
        <path fill="${colors[level]}" stroke="#fff" stroke-width="2" d="M12.5 0C5.6 0 0 5.6 0 12.5c0 12.5 12.5 28.5 12.5 28.5s12.5-16 12.5-28.5C25 5.6 19.4 0 12.5 0z"/>
        <circle fill="#fff" cx="12.5" cy="12.5" r="6"/>
      </svg>
    `)}`,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });
};

const MapView: React.FC<MapViewProps> = ({ containers, route, center, zoom = 12 }) => {
  const [mapKey, setMapKey] = useState(0);

  useEffect(() => {
    setMapKey(prev => prev + 1);
  }, [center]);

  const routePositions: LatLngExpression[] = route?.map(point => [point.lat, point.lng]) || [];

  return (
    <Box sx={{ height: '700px', width: '100%', position: 'relative' }}>
      <MapContainer
        key={mapKey}
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {containers.map((container) => (
          <Marker
            key={container.id}
            position={[container.latitude, container.longitude]}
            icon={createIcon(container.wasteLevel)}
          >
            <Popup>
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Container {container.id.slice(0, 8)}
                </Typography>
                {container.address && (
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {container.address}
                  </Typography>
                )}
                <Chip
                  label={container.wasteLevel.toUpperCase()}
                  size="small"
                  color={
                    container.wasteLevel === WasteLevel.HEAVY ? 'error' :
                    container.wasteLevel === WasteLevel.MEDIUM ? 'warning' : 'success'
                  }
                />
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Temperature: {container.temperature}°C
                </Typography>
              </Box>
            </Popup>
          </Marker>
        ))}

        {route && routePositions.length > 1 && (
          <Polyline
            positions={routePositions}
            color="#2E7D32"
            weight={4}
            opacity={0.7}
          />
        )}
      </MapContainer>
      
      {/* Compass */}
      <Box
        sx={{
          position: 'absolute',
          top: 10,
          right: 10,
          backgroundColor: 'white',
          borderRadius: '50%',
          width: 60,
          height: 60,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 2,
          zIndex: 1000,
          border: '2px solid #1976d2',
        }}
      >
        <Box sx={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* North arrow */}
          <Box
            sx={{
              position: 'absolute',
              top: 8,
              width: 0,
              height: 0,
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderBottom: '20px solid #d32f2f',
            }}
          />
          <Typography variant="caption" sx={{ position: 'absolute', top: 32, fontWeight: 'bold', color: '#1976d2' }}>
            N
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default MapView;