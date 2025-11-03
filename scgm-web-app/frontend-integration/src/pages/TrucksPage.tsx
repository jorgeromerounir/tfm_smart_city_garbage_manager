import { Add, Delete, Edit, LocalShipping, Search } from '@mui/icons-material'
import {
	Alert,
	Box,
	Button,
	CircularProgress,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControl,
	FormControlLabel,
	IconButton,
	InputAdornment,
	InputLabel,
	MenuItem,
	Pagination,
	Paper,
	Select,
	Switch,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TextField,
	Typography,
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { truckApi, citiesApi } from '../services/api'
import { TruckDto, TruckAddDto, TruckUpdateDto, City } from '../types'
import useNoti from '../hooks/useNoti'

const TrucksPage: React.FC = () => {
	const [trucks, setTrucks] = useState<TruckDto[]>([])
	const [cities, setCities] = useState<City[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [open, setOpen] = useState(false)
	const [editingTruck, setEditingTruck] = useState<TruckDto | null>(null)
	const [searchTerm, setSearchTerm] = useState('')
	const [currentPage, setCurrentPage] = useState(1)
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
	const [truckToDelete, setTruckToDelete] = useState<string | null>(null)
	const { showNoti, NotificationComponent } = useNoti()
	
	// Mock values - in real app these would come from context/auth
	const customerId = 1
	const defaultCityId = 1
	
	const [formData, setFormData] = useState<TruckAddDto>({
		name: '',
		licensePlate: '',
		capacity: 0,
		cityId: defaultCityId,
		customerId: customerId,
		available: true,
	})

	useEffect(() => {
		void fetchTrucks()
		void fetchCities()
	}, [])

	const fetchTrucks = async () => {
		try {
			setLoading(true)
			setError(null)
			const data = await truckApi.findByCustomerCity(customerId, defaultCityId, { limit: 500 })
			setTrucks(data)
		} catch (error) {
			console.error('Failed to fetch trucks:', error)
			setError('Failed to load trucks. Please try again.')
		} finally {
			setLoading(false)
		}
	}

	const fetchCities = async () => {
		try {
			const data = await citiesApi.getAll()
			setCities(data)
		} catch (error) {
			console.error('Failed to fetch cities:', error)
		}
	}

	const handleSubmit = async () => {
		if (editingTruck) {
			const updateData: TruckUpdateDto = {
				name: formData.name,
				licensePlate: formData.licensePlate,
				capacity: formData.capacity,
				available: formData.available,
			}
			truckApi.update(customerId, editingTruck.id, updateData).then(() => {
				fetchTrucks()
				handleClose()
				showNoti('Your truck has been updated successfully!', 'success')
			}).catch((error) => {
				console.error('Failed to update truck:', error)
				showNoti('Failed to update truck. Please try again.', 'error')
			})
		} else {
			truckApi.add(customerId, formData).then(() => {
				fetchTrucks()
				handleClose()
				showNoti('Your truck has been created successfully!', 'success')
			}).catch((error) => {
				console.error('Failed to create truck:', error)
				showNoti('Failed to create truck. Please try again.', 'error')
			})
		}
	}

	const handleDeleteClick = (id: string) => {
		setTruckToDelete(id)
		setDeleteDialogOpen(true)
	}

	const handleDeleteConfirm = () => {
		if (truckToDelete) {
			truckApi.delete(customerId, truckToDelete).then(() => {
				fetchTrucks()
				showNoti('Truck has been deleted successfully!', 'success')
			}).catch((error) => {
				console.error('Failed to delete truck:', error)
				showNoti('Failed to delete truck. Please try again.', 'error')
			})
		}
		setDeleteDialogOpen(false)
		setTruckToDelete(null)
	}

	const handleDeleteCancel = () => {
		setDeleteDialogOpen(false)
		setTruckToDelete(null)
	}

	const handleOpen = (truck?: TruckDto) => {
		if (truck) {
			setEditingTruck(truck)
			setFormData({
				name: truck.name,
				licensePlate: truck.licensePlate,
				capacity: truck.capacity,
				cityId: truck.cityId,
				customerId: truck.customerId,
				available: truck.available,
			})
		} else {
			setEditingTruck(null)
			setFormData({
				name: '',
				licensePlate: '',
				capacity: 0,
				cityId: defaultCityId,
				customerId: customerId,
				available: true,
			})
		}
		setOpen(true)
	}

	const handleClose = () => {
		setOpen(false)
		setEditingTruck(null)
	}

	const filteredTrucks = trucks.filter(truck => 
		truck.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
		truck.licensePlate.toLowerCase().includes(searchTerm.toLowerCase())
	)

	const itemsPerPage = 6
	const totalPages = Math.ceil(filteredTrucks.length / itemsPerPage)
	const paginatedTrucks = filteredTrucks.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	)

	const handleSearchChange = (value: string) => {
		setSearchTerm(value)
		setCurrentPage(1)
	}

	return (
		<>
		<NotificationComponent/>
		<Box>
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					mb: 3,
				}}
			>
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
					<LocalShipping color="primary" />
					<Typography variant="h4">Fleet Management</Typography>
				</Box>
				<Button
					variant="contained"
					startIcon={<Add />}
					onClick={() => handleOpen()}
					sx={{
						borderRadius: 2,
						textTransform: 'none',
						fontWeight: 600,
						px: 3,
						py: 1.5,
					}}
				>
					Add Truck
				</Button>
			</Box>

			{error && (
				<Alert severity="error" sx={{ mb: 2 }}>
					{error}
				</Alert>
			)}

			<TextField
				fullWidth
				placeholder="Search trucks by name or license plate..."
				value={searchTerm}
				onChange={(e) => handleSearchChange(e.target.value)}
				InputProps={{
					startAdornment: (
						<InputAdornment position="start">
							<Search />
						</InputAdornment>
					),
				}}
				sx={{ mb: 2 }}
			/>

			{!loading && (
				<Box sx={{ mb: 2, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
					<Typography variant="body2" color="text.secondary">
						Showing {paginatedTrucks.length} of {filteredTrucks.length} trucks
						{searchTerm && ` (filtered from ${trucks.length} total)`}
					</Typography>
				</Box>
			)}

			{loading ? (
				<Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
					<CircularProgress />
				</Box>
			) : (
				<TableContainer component={Paper}>
					<Table>
						<TableHead sx={{ backgroundColor: '#f1f8e9' }}>
							<TableRow>
								<TableCell>Name</TableCell>
								<TableCell>License Plate</TableCell>
								<TableCell>Capacity (tons)</TableCell>
								<TableCell>Status</TableCell>
								<TableCell>Actions</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{paginatedTrucks.length === 0 ? (
								<TableRow>
									<TableCell colSpan={5} align="center">
										<Typography color="text.secondary">
											{searchTerm ? 'No trucks match your search.' : 'No trucks found. Click "Add Truck" to create one.'}
										</Typography>
									</TableCell>
								</TableRow>
							) : (
								paginatedTrucks.map(truck => (
									<TableRow key={truck.id}>
										<TableCell>{truck.name}</TableCell>
										<TableCell>{truck.licensePlate}</TableCell>
										<TableCell>{truck.capacity}</TableCell>
										<TableCell>{truck.available ? 'Available' : 'Unavailable'}</TableCell>
										<TableCell>
											<IconButton onClick={() => handleOpen(truck)}>
												<Edit />
											</IconButton>
											<IconButton onClick={() => handleDeleteClick(truck.id)}>
												<Delete />
											</IconButton>
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</TableContainer>
			)}

			{!loading && totalPages > 1 && (
				<Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
					<Pagination
						count={totalPages}
						page={currentPage}
						onChange={(_, page) => setCurrentPage(page)}
						color="primary"
					/>
				</Box>
			)}

			<Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
				<DialogTitle>{editingTruck ? 'Edit Truck' : 'Add New Truck'}</DialogTitle>
				<DialogContent>
					<TextField
						fullWidth
						label="Truck Name"
						value={formData.name}
						onChange={e => setFormData({ ...formData, name: e.target.value })}
						margin="normal"
					/>
					<TextField
						fullWidth
						label="License Plate"
						value={formData.licensePlate}
						onChange={e => setFormData({ ...formData, licensePlate: e.target.value })}
						margin="normal"
					/>
					<TextField
						fullWidth
						label="Capacity (tons)"
						type="number"
						value={formData.capacity}
						onChange={e => setFormData({ ...formData, capacity: parseFloat(e.target.value) || 0 })}
						margin="normal"
					/>
					<FormControl fullWidth margin="normal">
						<InputLabel>City</InputLabel>
						<Select
							value={formData.cityId}
							label="City"
							onChange={e => setFormData({ ...formData, cityId: e.target.value as number })}
						>
							{cities.map(city => (
								<MenuItem key={city.id} value={city.id}>
									{city.name}, {city.country}
								</MenuItem>
							))}
						</Select>
					</FormControl>
					<FormControlLabel
						control={
							<Switch
								checked={formData.available}
								onChange={e => setFormData({ ...formData, available: e.target.checked })}
							/>
						}
						label="Available"
					/>
					<Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
						<Button
							onClick={handleSubmit}
							variant="contained"
							fullWidth
							sx={{
								borderRadius: 2,
								textTransform: 'none',
								fontWeight: 600,
								px: 3,
								py: 1.5,
							}}
						>
							{editingTruck ? 'Update' : 'Create'}
						</Button>
						<Button
							onClick={handleClose}
							variant="outlined"
							fullWidth
							sx={{
								borderRadius: 2,
								textTransform: 'none',
								fontWeight: 600,
								px: 3,
								py: 1.5,
							}}
						>
							Cancel
						</Button>
					</Box>
				</DialogContent>
			</Dialog>

			<Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
				<DialogTitle>Confirm Delete</DialogTitle>
				<DialogContent>
					<Typography>
						Are you sure you want to delete this truck? This action cannot be undone.
					</Typography>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleDeleteCancel}>Cancel</Button>
					<Button onClick={handleDeleteConfirm} color="error" variant="contained">
						Delete
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
		</>
	)
}

export default TrucksPage