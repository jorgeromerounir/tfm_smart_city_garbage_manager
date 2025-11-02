import { CheckCircle, Delete, Warning } from '@mui/icons-material'
import {
	Box,
	Card,
	CardContent,
	CircularProgress,
	Grid,
	Typography,
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { containerApi } from '../services/api'
import { StatusSummary } from '../types'
import useCustomer from '../hooks/useCustomer'

const Dashboard: React.FC = () => {
	const { user } = useAuth()
	const { customer } = useCustomer(user?.customerId);
	const [status, setStatus] = useState<StatusSummary | null>(null)
	const [loading, setLoading] = useState(true)
	const secondsToRefresh = 30
	const millisecondsToRefresh = secondsToRefresh * 1000;

	useEffect(() => {
		const fetchStatus = async () => {
			setLoading(true)
			try {
				if (!customer?.cityId) {
					setStatus({
						heavy: 0,
						light: 0,
						medium: 0,
						total: 0
					})
					return
				}
				const data = await containerApi.getStatusByCity(customer?.cityId);
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
	}, [customer?.cityId])

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
			color: '#E8F5E8',
		},
	]

	return (
		<Box>
			<Typography variant="h4" gutterBottom>Dashboard {customerName ? `- ${customerName}` : ''}</Typography>
			<Typography variant="subtitle1" color="text.secondary" gutterBottom>
				Real-time overview of waste container status (every {secondsToRefresh} seconds) for customer {customerName ? `${customerName}` : ''}
			</Typography>

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
		</Box>
	)
}

export default Dashboard
