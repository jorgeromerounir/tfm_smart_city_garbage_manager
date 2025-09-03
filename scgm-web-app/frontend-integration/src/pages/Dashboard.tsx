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

const Dashboard: React.FC = () => {
	const { user } = useAuth()
	const [status, setStatus] = useState<StatusSummary | null>(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const fetchStatus = async () => {
			try {
				const data = await containerApi.getStatus(user?.country)
				setStatus(data)
			} catch (error) {
				console.error('Failed to fetch status:', error)
			} finally {
				setLoading(false)
			}
		}

		void fetchStatus()
		const interval = setInterval(fetchStatus, 60000) // Update every minute

		return () => clearInterval(interval)
	}, [user?.country])

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
			<Typography variant="h4" gutterBottom>
				Dashboard
			</Typography>
			<Typography variant="subtitle1" color="text.secondary" gutterBottom>
				Real-time overview of waste container status
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
