import {
	Alert,
	Box,
	Button,
	Dialog,
	DialogContent,
	DialogTitle,
	TextField,
} from '@mui/material'
import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

interface SignInFormProps {
	open: boolean
	onClose: () => void
}

const SignInForm: React.FC<SignInFormProps> = ({ open, onClose }) => {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)
	const { signIn } = useAuth()

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setLoading(true)
		setError('')

		try {
			await signIn(email, password)
			onClose()
			setEmail('')
			setPassword('')
		} catch (err) {
			setError('Invalid credentials')
		} finally {
			setLoading(false)
		}
	}

	return (
		<Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
			<DialogTitle>Sign In</DialogTitle>
			<DialogContent>
				<Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
					{error && (
						<Alert severity="error" sx={{ mb: 2 }}>
							{error}
						</Alert>
					)}

					<TextField
						fullWidth
						label="Email"
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						margin="normal"
						required
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

					<Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
						<Button
							type="submit"
							variant="contained"
							disabled={loading}
							fullWidth
						>
							{loading ? 'Signing In...' : 'Sign In'}
						</Button>
						<Button onClick={onClose} variant="outlined" fullWidth>
							Cancel
						</Button>
					</Box>
				</Box>
			</DialogContent>
		</Dialog>
	)
}

export default SignInForm
