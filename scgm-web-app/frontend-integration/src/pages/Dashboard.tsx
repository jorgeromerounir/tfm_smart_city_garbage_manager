import { CheckCircle, Delete, Warning } from '@mui/icons-material'
import {
	Box,
	Card,
	CardContent,
	CircularProgress,
	FormControl,
	Grid,
	InputLabel,
	MenuItem,
	Select,
	Typography,
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { containerApi, citiesApi } from '../services/api'
import { StatusSummary, City } from '../types'
import useCustomer from '../hooks/useCustomer'
import useContainers from '../hooks/useContainers'
import MapViewDash from '../components/MapViewDash'

const Dashboard: React.FC = () => {
	const { user } = useAuth()
	const { customer } = useCustomer(user?.customerId)
	const [status, setStatus] = useState<StatusSummary | null>(null)
	const [loading, setLoading] = useState(true)
	const [cities, setCities] = useState<City[]>([])
	const [selectedCityId, setSelectedCityId] = useState<number>(customer?.cityId || 1)
	const secondsToRefresh = 10
	const millisecondsToRefresh = secondsToRefresh * 1000
	
	const { filteredContainers } = useContainers(customer?.id, selectedCityId, 500, 'true')
	
	const getSelectedCityCenter = (): [number, number] => {
		const selectedCity = cities.find(city => city.id === selectedCityId)
		return selectedCity ? [selectedCity.latitude, selectedCity.longitude] : [0, 0]
	}

	React.useEffect(() => {
		if (customer?.cityId) {
			setSelectedCityId(customer.cityId)
		}
	}, [customer?.cityId])

	React.useEffect(() => {
		void fetchCities()
	}, [])

	const fetchCities = async () => {
		try {
			const data = await citiesApi.getAll()
			setCities(data ? data : [])
		} catch (error) {
			console.error('Failed to fetch cities:', error)
		}
	}

	const resetStatus = () => {
		setStatus({
			heavy: 0,
			light: 0,
			medium: 0,
			total: 0
		})
	}

	useEffect(() => {
		const fetchStatus = async () => {
			setLoading(true)
			try {
				if (!selectedCityId || !customer?.id) {
					resetStatus()
					return
				}
				const data = await containerApi.getStatusByCity(customer?.id, selectedCityId);
				if (!data) {
					resetStatus()
					return
				}
				setStatus(data)
			} catch (error) {
				console.error('Failed to fetch status:', error)
			} finally {
				setLoading(false)
			}
		}
		void fetchStatus()
		const interval = setInterval(fetchStatus, millisecondsToRefresh) // Update every time
		return () => clearInterval(interval)
	}, [customer?.id, selectedCityId])

	if (loading) {
		return (
			<Box
				display="flex"
				justifyContent="center"
				alignItems="center"
				minHeight="400px"
			>
				<CircularProgress />
			</Box>
		)
	}

	const customerName = customer?.name

	const cards = [
		{
			title: 'Light Load',
			count: status?.light || 0,
			icon: <CheckCircle sx={{ fontSize: 40, color: '#4CAF50' }} />,
			color: '#E8F5E8',
		},
		{
			title: 'Medium Load',
			count: status?.medium || 0,
			icon: <Warning sx={{ fontSize: 40, color: '#FF9800' }} />,
			color: '#FFF3E0',
		},
		{
			title: 'Heavy Load',
			count: status?.heavy || 0,
			icon: <Delete sx={{ fontSize: 40, color: '#F44336' }} />,
			color: '#FFEBEE',
		},
		{
			title: 'Total Containers',
			count: status?.total || 0,
			icon: <Delete sx={{ fontSize: 40, color: '#2E7D32' }} />,
			color: '#f5f5f5',
		},
	]

	return (
		<Box>
			<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
				<Box>
					<Typography variant="h4" gutterBottom>Dashboard {customerName ? `- ${customerName}` : ''}</Typography>
					<Typography variant="subtitle1" color="text.secondary" gutterBottom>
						Real-time overview of waste container status (every {secondsToRefresh} seconds) for customer <b>{customerName ? `${customerName}` : ''}</b>
					</Typography>
				</Box>
				<FormControl sx={{ minWidth: 200 }}>
					<InputLabel>City</InputLabel>
					<Select
						value={selectedCityId}
						label="City"
						onChange={(e) => setSelectedCityId(e.target.value as number)}
					>
						{cities.map(city => (
							<MenuItem key={city.id} value={city.id}>
								{city.name}, {city.country}
							</MenuItem>
						))}
					</Select>
				</FormControl>
			</Box>

			<Grid container spacing={3} sx={{ mt: 2 }}>
				{cards.map((card, index) => (
					<Grid item xs={12} sm={6} md={3} key={index}>
						<Card sx={{ backgroundColor: card.color, height: '100%' }}>
							<CardContent>
								<Box
									display="flex"
									alignItems="center"
									justifyContent="space-between"
								>
									<Box>
										<Typography variant="h4" component="div" fontWeight="bold">
											{card.count}
										</Typography>
										<Typography variant="body2" color="text.secondary">
											{card.title}
										</Typography>
									</Box>
									{card.icon}
								</Box>
							</CardContent>
						</Card>
					</Grid>
				))}
			</Grid>

			<Box sx={{ mt: 3 }}>
				<Card sx={{ backgroundColor: '#f5f5f5' }}>
					<CardContent>
						<Typography variant="h6" gutterBottom>
							Containers Map View: enabled by zones
						</Typography>
						<MapViewDash
							containers={filteredContainers}
							center={getSelectedCityCenter()}
							customerId={customer?.id || 1}
						/>
					</CardContent>
				</Card>
			</Box>
		</Box>
	)
}

export default Dashboard
