import { Box } from '@mui/material'
import { Icon, LatLngExpression } from 'leaflet'
import React, { useEffect, useState } from 'react'
import { MapContainer, Marker, TileLayer } from 'react-leaflet'
import { Container, WasteLevel } from '../types'

interface MapViewDashProps {
	containers: Container[]
	center: [number, number]
	customerId: number
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
	})
}

const MapViewDash: React.FC<MapViewDashProps> = ({
	containers,
	center,
}) => {
	const [mapKey, setMapKey] = useState(0)

	useEffect(() => {
		setMapKey(prev => prev + 1)
	}, [center])

	return (
		<Box sx={{ height: '400px', width: '100%', position: 'relative' }}>
			<MapContainer
				key={mapKey}
				center={center}
				zoom={12}
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
					/>
				))}
			</MapContainer>
		</Box>
	)
}

export default MapViewDash