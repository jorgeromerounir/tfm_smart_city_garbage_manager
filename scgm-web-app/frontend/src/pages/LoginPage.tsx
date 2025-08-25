import { Login, RecyclingOutlined } from '@mui/icons-material'
import {
	Alert,
	Box,
	Button,
	CardContent,
	Container,
	Paper,
	TextField,
	Typography,
} from '@mui/material'
import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

const LoginPage: React.FC = () => {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)
	const { signIn } = useAuth()

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError('')
		setLoading(true)

		try {
			await signIn(email, password)
		} catch (err) {
			setError('Invalid credentials. Please try again.')
		} finally {
			setLoading(false)
		}
	}

	return (
		<Box
			sx={{
				minHeight: '100vh',
				background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			}}
		>
			<Container maxWidth="sm">
				<Paper elevation={10} sx={{ borderRadius: 3, overflow: 'hidden' }}>
					<Box
						sx={{
							p: 4,
							textAlign: 'center',
							bgcolor: 'primary.main',
							color: 'white',
						}}
					>
						<RecyclingOutlined sx={{ fontSize: 48, mb: 2 }} />
						<Typography variant="h4" component="h1" gutterBottom>
							Urban Waste Monitor
						</Typography>
						<Typography variant="subtitle1">
							Smart City Garbage Management System
						</Typography>
					</Box>

					<CardContent sx={{ p: 4 }}>
						<Typography
							variant="h5"
							component="h2"
							gutterBottom
							textAlign="center"
							mb={3}
						>
							Sign In
						</Typography>

						{error && (
							<Alert severity="error" sx={{ mb: 3 }}>
								{error}
							</Alert>
						)}

						<Box component="form" onSubmit={handleSubmit}>
							<TextField
								fullWidth
								label="Email"
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								margin="normal"
								required
								autoFocus
							/>

							<TextField
								fullWidth
								label="Password"
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								margin="normal"
								required
							/>

							<Button
								type="submit"
								fullWidth
								variant="contained"
								size="large"
								disabled={loading}
								startIcon={<Login />}
								sx={{
									mt: 3,
									mb: 2,
									py: 1.5,
									borderRadius: 2,
									textTransform: 'none',
									fontWeight: 600,
									px: 3,
								}}
							>
								{loading ? 'Signing In...' : 'Sign In'}
							</Button>
						</Box>

						<Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
							<Typography variant="body2" color="text.secondary" gutterBottom>
								Demo Accounts:
							</Typography>
							<Typography variant="caption" display="block">
								Admin: admin@uwm.com / admin123
							</Typography>
							<Typography variant="caption" display="block">
								Supervisor: john.doe@uwm.com / supervisor123
							</Typography>
						</Box>
					</CardContent>
				</Paper>
			</Container>
		</Box>
	)
}

export default LoginPage
