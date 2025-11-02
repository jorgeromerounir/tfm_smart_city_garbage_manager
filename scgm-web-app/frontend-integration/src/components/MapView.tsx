import { Box, Chip, Typography } from '@mui/material'
import { Icon, LatLngExpression } from 'leaflet'
import React, { useEffect, useState } from 'react'
import { MapContainer, Marker, Polyline, Popup, TileLayer } from 'react-leaflet'
import { Container, RoutePoint, VRPRoute, WasteLevel } from '../types'

interface MapViewProps {
	containers: Container[]
	route?: RoutePoint[]
	verpRoutes?: VRPRoute[]
	center: [number, number]
	zoom?: number
}

const containerColors = {
    [WasteLevel.LIGHT]: '#2E7D32',
    [WasteLevel.MEDIUM]: '#E65100',
    [WasteLevel.HEAVY]: '#B71C1C',
}

const createIcon = (level: WasteLevel) => {
	const color = containerColors[level]
	return new Icon({
		iconUrl: `data:image/svg+xml;base64,${btoa(`
		<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
			<circle fill="#fff" cx="8" cy="8" r="7" stroke="#333" stroke-width="1"/>
			<circle fill="${color}" cx="8" cy="8" r="5">
				<animate attributeName="r" values="3;6;3" dur="1.5s" repeatCount="indefinite"/>
				<animate attributeName="opacity" values="1;0.5;1" dur="1.5s" repeatCount="indefinite"/>
			</circle>
		</svg>
		`)}`,
		iconSize: [14, 14],
		iconAnchor: [8, 8],
		popupAnchor: [1, -34],
	})
}

const MapView: React.FC<MapViewProps> = ({
	containers,
	route,
	verpRoutes,
	center,
	zoom = 12,
}) => {
	const [mapKey, setMapKey] = useState(0)

	useEffect(() => {
		setMapKey(prev => prev + 1)
	}, [center])

	const routePositions: LatLngExpression[] =
		route?.map(point => [point.lat, point.lng]) || []

	const routeColors = ['#2E7D32', '#1976D2', '#F57C00', '#7B1FA2', '#D32F2F']

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

				{containers.map(container => (
					<Marker
						key={container.id}
						position={[container.latitude, container.longitude]}
						icon={createIcon(container.wasteLevelStatus)}
					>
						<Popup>
							<Box>
								<Typography variant="subtitle2" gutterBottom>
									Container {container.id.slice(0, 8)}
								</Typography>
								{container.address && (
									<Typography
										variant="body2"
										color="text.secondary"
										gutterBottom
									>
										{container.address}
									</Typography>
								)}
								<Chip
									label={container.wasteLevelStatus.toUpperCase()}
									size="small"
									color={
										container.wasteLevelStatus === WasteLevel.HEAVY
											? 'error'
											: container.wasteLevelStatus === WasteLevel.MEDIUM
												? 'warning'
												: 'success'
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

				{verpRoutes?.map((vrpRoute, index) => {
					const positions: LatLngExpression[] = vrpRoute.points.map(point => [
						point.lat,
						point.lng,
					])
					return (
						positions.length > 1 && (
							<Polyline
								key={vrpRoute.truckId}
								positions={positions}
								color={routeColors[index % routeColors.length]}
								weight={4}
								opacity={0.8}
								dashArray={index > 0 ? '10, 5' : undefined}
							>
								<Popup>
									<Typography variant="subtitle2">
										{vrpRoute.truckName}
									</Typography>
									<Typography variant="body2">
										{vrpRoute.points.length - 2} containers
									</Typography>
								</Popup>
							</Polyline>
						)
					)
				})}
			</MapContainer>

			{/* Route Legend */}
			{verpRoutes && verpRoutes.length > 0 && (
				<Box
					sx={{
						position: 'absolute',
						top: 10,
						left: 10,
						backgroundColor: 'white',
						borderRadius: 2,
						p: 2,
						boxShadow: 2,
						zIndex: 1000,
						maxWidth: 200,
					}}
				>
					<Typography variant="subtitle2" gutterBottom>
						Truck Routes
					</Typography>
					{verpRoutes.map((vrpRoute, index) => (
						<Box key={vrpRoute.truckId} sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
							<Box
								sx={{
									width: 20,
									height: 3,
									backgroundColor: routeColors[index % routeColors.length],
									mr: 1,
									borderRadius: 1,
								}}
							/>
							<Typography variant="caption">
								{vrpRoute.truckName}
							</Typography>
						</Box>
					))}
				</Box>
			)}

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
				<Box
					sx={{
						position: 'relative',
						width: '100%',
						height: '100%',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
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
					<Typography
						variant="caption"
						sx={{
							position: 'absolute',
							top: 32,
							fontWeight: 'bold',
							color: '#1976d2',
						}}
					>
						N
					</Typography>
				</Box>
			</Box>
		</Box>
	)
}

export default MapView
