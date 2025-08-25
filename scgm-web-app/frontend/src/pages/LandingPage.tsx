import {
	Login,
	MapOutlined,
	PeopleOutlined,
	RecyclingOutlined,
	RouteOutlined,
} from '@mui/icons-material'
import {
	Box,
	Button,
	Card,
	CardContent,
	Container,
	Grid,
	Paper,
	Typography,
} from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const LandingPage: React.FC = () => {
	const navigate = useNavigate()

	const features = [
		{
			icon: <MapOutlined sx={{ fontSize: 40 }} />,
			title: 'Real-time Monitoring',
			description:
				'Track waste container levels across the city with live updates',
		},
		{
			icon: <RouteOutlined sx={{ fontSize: 40 }} />,
			title: 'Route Optimization',
			description: 'AI-powered route planning for efficient waste collection',
		},
		{
			icon: <PeopleOutlined sx={{ fontSize: 40 }} />,
			title: 'Multi-city Support',
			description: 'Manage waste collection across multiple cities and regions',
		},
	]

	return (
		<Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
			{/* Hero Section */}
			<Box
				sx={{
					background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
					color: 'white',
					py: 12,
				}}
			>
				<Container maxWidth="lg">
					<Grid container spacing={4} alignItems="center">
						<Grid item xs={12} md={6}>
							<Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
								<RecyclingOutlined sx={{ fontSize: 60, mr: 2 }} />
								<Typography variant="h3" component="h1" fontWeight="bold">
									Urban Waste Monitor
								</Typography>
							</Box>
							<Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
								Smart City Garbage Management System
							</Typography>
							<Typography variant="body1" sx={{ mb: 4, fontSize: '1.1rem' }}>
								Monitor waste container levels in real-time, optimize collection
								routes, and manage urban waste efficiently across multiple
								cities.
							</Typography>
							<Button
								variant="contained"
								size="large"
								startIcon={<Login />}
								onClick={() => navigate('/login')}
								sx={{
									bgcolor: 'white',
									color: 'primary.main',
									px: 4,
									py: 1.5,
									borderRadius: 2,
									textTransform: 'none',
									fontWeight: 600,
									'&:hover': { bgcolor: 'grey.100' },
								}}
							>
								Sign In to Dashboard
							</Button>
						</Grid>
						<Grid item xs={12} md={6}>
							<Paper
								elevation={10}
								sx={{
									p: 3,
									borderRadius: 3,
									bgcolor: 'rgba(255,255,255,0.1)',
									backdropFilter: 'blur(10px)',
								}}
							>
								<Typography variant="h6" gutterBottom>
									System Status
								</Typography>
								<Box
									sx={{
										display: 'flex',
										justifyContent: 'space-between',
										mb: 2,
									}}
								>
									<Typography>Active Containers:</Typography>
									<Typography fontWeight="bold">1,247</Typography>
								</Box>
								<Box
									sx={{
										display: 'flex',
										justifyContent: 'space-between',
										mb: 2,
									}}
								>
									<Typography>Cities Monitored:</Typography>
									<Typography fontWeight="bold">2</Typography>
								</Box>
								<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
									<Typography>Collection Routes:</Typography>
									<Typography fontWeight="bold">Active</Typography>
								</Box>
							</Paper>
						</Grid>
					</Grid>
				</Container>
			</Box>

			{/* Features Section */}
			<Container maxWidth="lg" sx={{ py: 8 }}>
				<Typography variant="h4" textAlign="center" gutterBottom>
					Key Features
				</Typography>
				<Typography
					variant="body1"
					textAlign="center"
					color="text.secondary"
					sx={{ mb: 6 }}
				>
					Comprehensive waste management solution for modern cities
				</Typography>

				<Grid container spacing={4}>
					{features.map((feature, index) => (
						<Grid item xs={12} md={4} key={index}>
							<Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
								<CardContent>
									<Box sx={{ color: 'primary.main', mb: 2 }}>
										{feature.icon}
									</Box>
									<Typography variant="h6" gutterBottom>
										{feature.title}
									</Typography>
									<Typography variant="body2" color="text.secondary">
										{feature.description}
									</Typography>
								</CardContent>
							</Card>
						</Grid>
					))}
				</Grid>
			</Container>
		</Box>
	)
}

export default LandingPage
