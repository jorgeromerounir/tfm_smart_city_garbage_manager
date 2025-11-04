import { Box, Typography, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material'
import { KeyboardArrowUp, KeyboardArrowDown, KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material'
import { Icon } from 'leaflet'
import React, { useEffect, useState } from 'react'
import { MapContainer, Marker, Rectangle, TileLayer, useMapEvents, Tooltip, Popup } from 'react-leaflet'
import { City, Container, ContainerZoneUpdateDto } from '../types'
import useZones, { Zone } from '../hooks/useZones'
import useDeleteZone from '../hooks/useDeleteZone'
import useUpdateMultipleZonesId from '../hooks/useUpdateMultipleZonesId'
import useNoti from '../hooks/useNoti'

interface MapViewZonesProps {
	containers: Container[]
  city: City
	center: [number, number]
  customerId: number
	zonesHook?: { zones: Zone[], setZones: (zones: Zone[]) => void }
	zoom?: number
}

const zonesLimit = 25

const zoneColors = [
    '#A020F0', '#1A5276', '#800000', '#483D8B', '#9400D3',
    '#6A5ACD', '#B22222', '#4682B4', '#CD5C5C', '#000080',
    '#8B008B', '#556B2F', '#2F4F4F', '#8B4513', '#A9A9A9',
    '#5F9EA0', '#708090', '#40E0D0', '#6495ED', '#B0C4DE',
    '#9932CC', '#C71585', '#4169E1', '#808080', '#DC143C'
];

const createIcon = (zoneId: string) => {
  const color = zoneId ? '#5CCB5F' : '#F44336'
	const icon = new Icon({
		iconUrl: `data:image/svg+xml;base64,${btoa(`
		<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
			<circle fill="${color}" cx="7" cy="7" r="7" stroke="#333" stroke-width="3"/>
		</svg>
		`)}`,
		iconSize: [7, 7],
		iconAnchor: [7, 7],
		popupAnchor: [0, -4],
	})
	return icon
}

const MapViewZones: React.FC<MapViewZonesProps> = ({
	containers,
	center,
  customerId,
	zonesHook,
	zoom = 12
}) => {
	const [mapKey, setMapKey] = useState(0)
	const internalZonesHook = useZones()
  const deleteZoneHook = useDeleteZone()
	const { zones, setZones } = zonesHook || internalZonesHook
	const [isDrawing, setIsDrawing] = useState(false)
	const [startPoint, setStartPoint] = useState<[number, number] | null>(null)
	const [currentZone, setCurrentZone] = useState<Zone | null>(null)
	const [hasOverlap, setHasOverlap] = useState(false)
	const [isSpacePressed, setIsSpacePressed] = useState(false)
	const [mapCenter, setMapCenter] = useState<[number, number]>(center)
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
	const [zoneToDelete, setZoneToDelete] = useState<string | null>(null)
	const [addContainersDialogOpen, setAddContainersDialogOpen] = useState(false)
	const [zoneToAddContainers, setZoneIdToAddContainers] = useState<string | null>(null)
  const { showNoti, NotificationComponent } = useNoti()
  const hookUpdateMultipleZones = useUpdateMultipleZonesId()
  //-----
	useEffect(() => {
		setMapCenter(center)
		// Solo cambiar key si el centro cambió significativamente
		const distance = Math.abs(center[0] - mapCenter[0]) + Math.abs(center[1] - mapCenter[1])
		if (distance > 0.1) {
			setMapKey(prev => prev + 1)
		}
	}, [center])
  //-----
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.code === 'Space' && !isSpacePressed) {
				e.preventDefault()
				setIsSpacePressed(true)
			}
		}

		const handleKeyUp = (e: KeyboardEvent) => {
			if (e.code === 'Space') {
				e.preventDefault()
				setIsSpacePressed(false)
			}
		}

		window.addEventListener('keydown', handleKeyDown)
		window.addEventListener('keyup', handleKeyUp)

		return () => {
			window.removeEventListener('keydown', handleKeyDown)
			window.removeEventListener('keyup', handleKeyUp)
		}
	}, [isSpacePressed])

  const reduceText = function(textValue: string) {
    if(!textValue)
      return ''
    const textNumChars = 20
    if (textValue.length > textNumChars) {
      return textValue.substring(0, textNumChars) + '...'
    }
    return textValue
  }

  const reduceDecimal = function(numValue: number) {
    if(!numValue)
      return 0.0000
    return Number(numValue.toFixed(4))
  }

  const handleArrowNavigation = (direction: 'up' | 'down' | 'left' | 'right') => {
		const increment = 0.04
		setMapCenter(prev => {
			switch (direction) {
				case 'up':
					return [prev[0] + increment, prev[1]]
				case 'down':
					return [prev[0] - increment, prev[1]]
				case 'left':
					return [prev[0], prev[1] - increment]
				case 'right':
					return [prev[0], prev[1] + increment]
				default:
					return prev
			}
		})
		// Evitar re-crear el mapa en cada navegación
		setMapKey(prev => prev + 1)
	}

	const checkZoneOverlap = (newBounds: [[number, number], [number, number]]) => {
		const [[newStartLat, newStartLng], [newEndLat, newEndLng]] = newBounds
		const newMinLat = Math.min(newStartLat, newEndLat)
		const newMaxLat = Math.max(newStartLat, newEndLat)
		const newMinLng = Math.min(newStartLng, newEndLng)
		const newMaxLng = Math.max(newStartLng, newEndLng)
		return zones.some(zone => {
			const [[startLat, startLng], [endLat, endLng]] = zone.bounds
			const minLat = Math.min(startLat, endLat)
			const maxLat = Math.max(startLat, endLat)
			const minLng = Math.min(startLng, endLng)
			const maxLng = Math.max(startLng, endLng)
			// Check if rectangles overlap
			return !(
				newMaxLat < minLat || // new zone is above existing zone
				newMinLat > maxLat || // new zone is below existing zone
				newMaxLng < minLng || // new zone is left of existing zone
				newMinLng > maxLng    // new zone is right of existing zone
			)
		})
	}

  const getNextIdForZone = function() {
    if(zones.length === 0) return 'zone-1'
    const maxId = zones.reduce((max, zone) => {
      const zoneId = parseInt(zone.id.split('-')[1]);
      return zoneId > max ? zoneId : max;
    }, 0);
    return `zone-${(maxId + 1)}`;
  }

	const handleDeleteClick = (zoneId: string) => {
		setZoneToDelete(zoneId)
		setDeleteDialogOpen(true)
	}

	const confirmDelete = () => {
		if (zoneToDelete) {
			console.log('---> Delete zone: ', zoneToDelete)
      deleteZoneHook.deleteZone(customerId, zoneToDelete).finally(() => {
        setZones((prev) => prev.filter(zone => zone.id !== zoneToDelete))
      })
		}
		setDeleteDialogOpen(false)
		setZoneToDelete(null)
	}

	const cancelDelete = () => {
		setDeleteDialogOpen(false)
		setZoneToDelete(null)
	}

	const handleAddContainers = (zoneId: string) => {
		setZoneIdToAddContainers(zoneId)
		setAddContainersDialogOpen(true)
	}

  const isValidUUID = (str: string | null) => {
    if(!str)
      return false
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    return uuidRegex.test(str)
  }

	const confirmAddContainers = () => {
		if (isValidUUID(zoneToAddContainers)) {
			const targetZone = zones.find(zone => zone.id === zoneToAddContainers)
			if (targetZone) {
				const [[startLat, startLng], [endLat, endLng]] = targetZone.bounds
				const minLat = Math.min(startLat, endLat)
				const maxLat = Math.max(startLat, endLat)
				const minLng = Math.min(startLng, endLng)
				const maxLng = Math.max(startLng, endLng)
				const containersInZone = containers.filter(container => 
					container.latitude >= minLat && container.latitude <= maxLat &&
					container.longitude >= minLng && container.longitude <= maxLng &&
					container.zoneId == null
				)
				const containerZoneUpdates: ContainerZoneUpdateDto[] = containersInZone.map(container => ({
					containerId: container.id,
					zoneId: zoneToAddContainers
				}))
        if (containerZoneUpdates.length === 0) {
          setAddContainersDialogOpen(false)
		      setZoneIdToAddContainers(null)
          showNoti(`No containers found to add in the zone: ${zoneToAddContainers}`, 'warning')
          return
        }
        hookUpdateMultipleZones.updateMultipleZonesId(customerId, containerZoneUpdates).then(() => {
          setZones(prev => prev.map(zone => {
            if (zone.id === zoneToAddContainers) {
              return { ...zone, color: '#5CCB5F' }
            }
            showNoti('Containers assigned to zone successfully! Refresh your map', 'success')
            return zone
          }))
        }).catch(() => {
          showNoti('Error trying to add containers to the zone!', 'error')
        })
			}
		} else {
      showNoti('First you need to save your zone settings', 'warning')
    }
		setAddContainersDialogOpen(false)
		setZoneIdToAddContainers(null)
	}

	const cancelAddContainers = () => {
		setAddContainersDialogOpen(false)
		setZoneIdToAddContainers(null)
	}

	const analyzeZone = (zone: Zone) => {
		const [[startLat, startLng], [endLat, endLng]] = zone.bounds
		const minLat = Math.min(startLat, endLat)
		const maxLat = Math.max(startLat, endLat)
		const minLng = Math.min(startLng, endLng)
		const maxLng = Math.max(startLng, endLng)
		const containersInZone = containers.filter(container => 
			container.latitude >= minLat && container.latitude <= maxLat &&
			container.longitude >= minLng && container.longitude <= maxLng &&
      container.zoneId == null
		)
		const stats = {
			total: containersInZone.length,
			bounds: zone.bounds
		}
		//console.log(`Zone ${zone.id} Analysis:`, stats)
    return stats
	}

  const closePopup = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const popup = e.currentTarget.closest('.leaflet-popup')
    if (popup) {
      const closeBtn = popup.querySelector('.leaflet-popup-close-button') as HTMLElement
      if (closeBtn) closeBtn.click()
    }
  }

  const isZoneSizeValid = (bounds: [[number, number], [number, number]]) => {
    const [[startLat, startLng], [endLat, endLng]] = bounds
    const latDiff = Math.abs(endLat - startLat)
    const lngDiff = Math.abs(endLng - startLng)
    const minSize = 0.010 // Tamaño mínimo en grados (aproximadamente 1000 metros)
    return latDiff >= minSize && lngDiff >= minSize
  }

	const MapEvents = () => {
		useMapEvents({
			mousedown: (e) => {
				if (zones.length >= zonesLimit || isSpacePressed) return
				setIsDrawing(true)
				setStartPoint([e.latlng.lat, e.latlng.lng])
				setHasOverlap(false)
			},
			mousemove: (e) => {
				if (!isDrawing || !startPoint) return
				const endPoint: [number, number] = [e.latlng.lat, e.latlng.lng]
				const newBounds: [[number, number], [number, number]] = [startPoint, endPoint]
				const overlap = checkZoneOverlap(newBounds)
				setHasOverlap(overlap)

				const zoneId = getNextIdForZone()
				const color = overlap ? '#FF0000' : zoneColors[zones.length % zoneColors.length]
				setCurrentZone({
					id: zoneId,
          name: `Zone ${zones.length + 1}`,
					bounds: newBounds,
					color: color,
          center: [(startPoint[0] + endPoint[0]) / 2, (startPoint[1] + endPoint[1]) / 2]
				})
			},
			mouseup: () => {
				if (!isDrawing || !currentZone || hasOverlap || 
          // Validar tamaño mínimo de la zona
          !isZoneSizeValid(currentZone.bounds)) {
					setIsDrawing(false)
					setStartPoint(null)
					setCurrentZone(null)
					setHasOverlap(false)
					return
				}
				setZones(prev => [...prev, currentZone])
				//analyzeZone(currentZone)
				setIsDrawing(false)
				setStartPoint(null)
				setCurrentZone(null)
				setHasOverlap(false)
			}
		})
		return null
	}

	return (
    <>
    <NotificationComponent />
    <Box sx={{ height: "700px", width: "100%", position: "relative", cursor: isSpacePressed ? "grab" : "crosshair" }}>
      <MapContainer
        key={mapKey}
        center={mapCenter}
        zoom={zoom}
        zoomControl={true}
        scrollWheelZoom={true}
        doubleClickZoom={true}
        style={{ height: "100%", width: "100%" }}
        dragging={isSpacePressed}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapEvents />

        {/* Render existing zones */}
        {zones.map((zone) => (
          <Rectangle
            key={zone.id}
            bounds={zone.bounds}
            pathOptions={{
              color: zone.color,
              fillColor: zone.color,
              fillOpacity: 0.4,
              weight: 2,
            }}
          >
             <Popup>
              <div>
                <strong>Zone ID:</strong> {zone.id}<br />
                <strong>Name:</strong> {zone.name}<br />
                <strong>Center:</strong> {reduceDecimal(zone.center[0])} | {reduceDecimal(zone.center[1])}<br />
                <strong>Total containers in:</strong> {analyzeZone(zone).total}<br />
                <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
                  <button 
                    onClick={() => handleDeleteClick(zone.id)}
                    style={{ 
                      padding: '4px 8px', 
                      backgroundColor: '#d32f2f', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '4px', 
                      cursor: 'pointer' 
                    }}
                  >
                    Delete
                  </button>
                  <button 
                    onClick={closePopup}
                    style={{ 
                      padding: '4px 8px', 
                      backgroundColor: '#757575', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '4px', 
                      cursor: 'pointer' 
                    }}
                  >
                    Close
                  </button>
                  <button 
                    onClick={() => handleAddContainers(zone.id)}
                    style={{ 
                      padding: '4px 8px', 
                      backgroundColor: '#5CCB5F', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '4px', 
                      cursor: 'pointer' 
                    }}
                  >
                    Add Containers
                  </button>
                </div>
              </div>
            </Popup>
          </Rectangle>
        ))}

        {/* Render current drawing zone */}
        {currentZone && (
          <Rectangle
            bounds={currentZone.bounds}
            pathOptions={{
              color: currentZone.color,
              fillColor: currentZone.color,
              fillOpacity: hasOverlap ? 0.2 : 0.5,
              weight: 2,
              dashArray: hasOverlap ? "10, 10" : "5, 5",
            }}
          />
        )}

        {containers.map((container) => (
          <Marker key={container.id} position={[container.latitude, container.longitude]} icon={createIcon(container.zoneId)}>
            <Tooltip>
              <div>
                <strong>Container ID:</strong> {reduceText(container.id)}<br />
                <strong>Address:</strong> {reduceText(container.address)}<br />
                <strong>Updated:</strong> {new Date(container.updatedAt).toLocaleString()}
              </div>
            </Tooltip>
          </Marker>
        ))}
      </MapContainer>

      {/* Navigation Arrows */}
      <Box
        sx={{
          position: "absolute",
          bottom: 20,
          left: 20,
          display: "grid",
          gridTemplateColumns: "repeat(3, 40px)",
          gridTemplateRows: "repeat(3, 40px)",
          gap: "2px",
          zIndex: 1000,
        }}
      >
        {/* Empty cell */}
        <Box />
        {/* Up arrow */}
        <IconButton
          onClick={() => handleArrowNavigation("up")}
          sx={{
            backgroundColor: "white",
            boxShadow: 2,
            "&:hover": { backgroundColor: "#f5f5f5" },
          }}
        >
          <KeyboardArrowUp />
        </IconButton>
        {/* Empty cell */}
        <Box />
        {/* Left arrow */}
        <IconButton
          onClick={() => handleArrowNavigation("left")}
          sx={{
            backgroundColor: "white",
            boxShadow: 2,
            "&:hover": { backgroundColor: "#f5f5f5" },
          }}
        >
          <KeyboardArrowLeft />
        </IconButton>
        {/* Empty cell */}
        <Box />
        {/* Right arrow */}
        <IconButton
          onClick={() => handleArrowNavigation("right")}
          sx={{
            backgroundColor: "white",
            boxShadow: 2,
            "&:hover": { backgroundColor: "#f5f5f5" },
          }}
        >
          <KeyboardArrowRight />
        </IconButton>
        {/* Empty cell */}
        <Box />
        {/* Down arrow */}
        <IconButton
          onClick={() => handleArrowNavigation("down")}
          sx={{
            backgroundColor: "white",
            boxShadow: 2,
            "&:hover": { backgroundColor: "#f5f5f5" },
          }}
        >
          <KeyboardArrowDown />
        </IconButton>
        {/* Empty cell */}
        <Box />
      </Box>

      {/* Compass */}
      <Box
        sx={{
          position: "absolute",
          top: 10,
          right: 10,
          backgroundColor: "white",
          borderRadius: "50%",
          width: 60,
          height: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: 2,
          zIndex: 1000,
          border: "2px solid #1976d2",
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* North arrow */}
          <Box
            sx={{
              position: "absolute",
              top: 8,
              width: 0,
              height: 0,
              borderLeft: "6px solid transparent",
              borderRight: "6px solid transparent",
              borderBottom: "20px solid #d32f2f",
            }}
          />
          <Typography
            variant="caption"
            sx={{
              position: "absolute",
              top: 32,
              fontWeight: "bold",
              color: "#1976d2",
            }}
          >
            N
          </Typography>
        </Box>
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={cancelDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this zone? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Containers Confirmation Dialog */}
      <Dialog open={addContainersDialogOpen} onClose={cancelAddContainers}>
        <DialogTitle>Add Containers</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to add containers to this zone?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelAddContainers} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmAddContainers} color="success" variant="contained">
            Add Containers
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
    </>
  );
}

export default MapViewZones