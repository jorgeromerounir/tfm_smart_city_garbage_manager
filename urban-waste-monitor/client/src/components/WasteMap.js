import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents } from 'react-leaflet';
import { Box, Typography, Chip, CircularProgress } from '@mui/material';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './WasteMap.css';

function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click: (e) => {
      if (onMapClick) {
        onMapClick(e.latlng.lat, e.latlng.lng);
      }
    }
  });
  return null;
}



// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons for different waste levels
const createWasteIcon = (level, needsCollection = false) => {
  const colors = {
    light: '#4caf50',
    medium: '#ff9800', 
    heavy: '#f44336'
  };
  
  const size = needsCollection ? 25 : 20;
  const border = needsCollection ? '3px solid #000' : '2px solid white';
  const pulse = needsCollection ? 'animation: pulse 2s infinite;' : '';
  
  return L.divIcon({
    html: `<div style="background-color: ${colors[level]}; width: ${size}px; height: ${size}px; border-radius: 50%; border: ${border}; box-shadow: 0 2px 4px rgba(0,0,0,0.3); ${pulse}"></div><style>@keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.1); } 100% { transform: scale(1); } }</style>`,
    className: 'custom-waste-marker',
    iconSize: [size, size],
    iconAnchor: [size/2, size/2]
  });
};

function WasteMap({ containers, route, loading, center = [40.4168, -3.7038], highlightCollection = false, onMapClick }) {
  const [map, setMap] = useState(null);
  
  useEffect(() => {
    if (map && containers.length > 0) {
      const group = new L.featureGroup(containers.map(container => 
        L.marker([container.latitude, container.longitude])
      ));
      map.fitBounds(group.getBounds().pad(0.1));
    }
  }, [map, containers]);
  
  const getLevelColor = (level) => {
    switch (level) {
      case 'heavy': return 'error';
      case 'medium': return 'warning';
      case 'light': return 'success';
      default: return 'default';
    }
  };
  
  const formatLastUpdated = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };
  
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height={400}>
        <CircularProgress />
        <Typography variant="body1" sx={{ ml: 2 }}>
          Loading map data...
        </Typography>
      </Box>
    );
  }
  
  return (
    <Box sx={{ height: 500, width: '100%', position: 'relative' }}>
      {/* Compass overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 10,
          right: 10,
          zIndex: 1000,
          background: 'white',
          border: '2px solid #ccc',
          borderRadius: '50%',
          width: 40,
          height: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          cursor: 'pointer'
        }}
        title="North direction"
      >
        🧭
      </Box>
      <MapContainer
        key={`${center[0]}-${center[1]}`}
        center={center}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        whenCreated={setMap}
        aria-label="Waste container locations map"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapClickHandler onMapClick={onMapClick} />
        
        {containers.filter(container => 
          container.latitude && container.longitude && 
          !isNaN(container.latitude) && !isNaN(container.longitude)
        ).map((container) => {
          const needsCollection = highlightCollection && (container.waste_level === 'medium' || container.waste_level === 'heavy');
          return (
          <Marker
            key={container.id}
            position={[container.latitude, container.longitude]}
            icon={createWasteIcon(container.waste_level, needsCollection)}
          >
            <Popup>
              <Box sx={{ minWidth: 200 }}>
                <Typography variant="h6" gutterBottom>
                  Container {container.id}
                </Typography>
                
                <Box sx={{ mb: 1 }}>
                  <Chip 
                    label={container.waste_level.toUpperCase()}
                    color={getLevelColor(container.waste_level)}
                    size="small"
                  />
                </Box>
                
                <Typography variant="body2" color="text.secondary">
                  Battery: {container.battery_level}%
                </Typography>
                
                <Typography variant="body2" color="text.secondary">
                  Temperature: {container.temperature}°C
                </Typography>
                
                <Typography variant="body2" color="text.secondary">
                  Updated: {formatLastUpdated(container.last_updated)}
                </Typography>
                
                {container.address && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    📍 {container.address}
                  </Typography>
                )}
              </Box>
            </Popup>
          </Marker>
          );
        })}
        
        {route && route.length > 1 && (
          <>
            <Polyline
              positions={route.map(point => [point.latitude, point.longitude])}
              color="#2196f3"
              weight={4}
              opacity={0.8}
              dashArray="10, 5"
              className="animated-route"
            />
            
            {route.map((point, index) => {
              if (index === route.length - 1) return null;
              const nextPoint = route[index + 1];
              const midLat = (point.latitude + nextPoint.latitude) / 2;
              const midLon = (point.longitude + nextPoint.longitude) / 2;
              
              if (isNaN(midLat) || isNaN(midLon)) return null;
              
              return (
                <Marker
                  key={`arrow-${index}`}
                  position={[midLat, midLon]}
                  icon={L.divIcon({
                    html: '<div style="color: #2196f3; font-size: 16px; text-shadow: 1px 1px 2px white;">➤</div>',
                    className: 'route-arrow',
                    iconSize: [16, 16],
                    iconAnchor: [8, 8]
                  })}
                />
              );
            })}
            
            {route.filter(point => 
              point.type === 'depot' && 
              point.latitude && point.longitude && 
              !isNaN(point.latitude) && !isNaN(point.longitude)
            ).map((depot, index) => (
              <Marker
                key={`depot-${index}`}
                position={[depot.latitude, depot.longitude]}
                icon={L.divIcon({
                  html: `<div style="background: linear-gradient(45deg, #4caf50, #2e7d32); width: 30px; height: 30px; border-radius: 50%; border: 3px solid #fff; box-shadow: 0 3px 6px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 12px;">S</div>`,
                  className: 'depot-marker',
                  iconSize: [30, 30],
                  iconAnchor: [15, 15]
                })}
              >
                <Popup>
                  <Box sx={{ minWidth: 150 }}>
                    <Typography variant="h6" gutterBottom>
                      🏁 Start Point
                    </Typography>
                    <Typography variant="body2">
                      Depot Location
                    </Typography>
                  </Box>
                </Popup>
              </Marker>
            ))}
          </>
        )}
      </MapContainer>
    </Box>
  );
}

export default WasteMap;