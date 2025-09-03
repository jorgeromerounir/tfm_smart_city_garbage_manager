import { Add, Delete } from '@mui/icons-material'
import {
	Box,
	Button,
	Chip,
	IconButton,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from '@mui/material'
import React from 'react'
import CreateUserForm from '../components/CreateUserForm.tsx'
import useUsers from '../hooks/useUsers.ts'

const UsersPage: React.FC = () => {
	const {
		loading,
		users,
		canCreateUsers,
		canManage,
		setCreateFormOpen,
		getProfileColor,
		handleDeleteUser,
		createFormOpen,
		fetchUsers,
	} = useUsers()

	if (loading) {
		return <Typography>Loading...</Typography>
	}

	return (
		<Box>
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					mb: 3,
				}}
			>
				<Typography variant="h4" component="h1">
					User Management
				</Typography>
				{canCreateUsers && (
					<Button
						variant="contained"
						startIcon={<Add />}
						onClick={() => setCreateFormOpen(true)}
						sx={{
							borderRadius: 2,
							textTransform: 'none',
							fontWeight: 600,
							px: 3,
							py: 1.5,
						}}
					>
						Create User
					</Button>
				)}
			</Box>

			<TableContainer component={Paper}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>Name</TableCell>
							<TableCell>Email</TableCell>
							<TableCell>Profile</TableCell>
							<TableCell>Created At</TableCell>
							<TableCell>Actions</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{users.map(u => (
							<TableRow key={u.id}>
								<TableCell>{u.name}</TableCell>
								<TableCell>{u.email}</TableCell>
								<TableCell>
									<Chip
										label={u.profile}
										color={getProfileColor(u.profile)}
										size="small"
									/>
								</TableCell>
								<TableCell>
									{new Date(u.createdAt).toLocaleDateString()}
								</TableCell>
								<TableCell>
									{canManage(u.profile) && (
										<IconButton
											color="error"
											onClick={() => handleDeleteUser(u.id, u.profile)}
										>
											<Delete />
										</IconButton>
									)}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>

			<CreateUserForm
				open={createFormOpen}
				onClose={() => setCreateFormOpen(false)}
				onSuccess={fetchUsers}
			/>
		</Box>
	)
}

export default UsersPage
