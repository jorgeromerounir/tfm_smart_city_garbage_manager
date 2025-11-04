import { Add, Delete, Edit, LocationCity, Search } from '@mui/icons-material'
import {
	Alert,
	Autocomplete,
	Box,
	Button,
	CircularProgress,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControlLabel,
	IconButton,
	InputAdornment,
	Pagination,
	Paper,
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
import { AVAILABLE_CITIES } from '../data/cities'
import { citiesApi } from '../services/api'
import { City } from '../types'
import useNoti from '../hooks/useNoti'

const CitiesPage: React.FC = () => {
	const [cities, setCities] = useState<City[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [open, setOpen] = useState(false)
	const [editingCity, setEditingCity] = useState<City | null>(null)
	const [selectedCityOption, setSelectedCityOption] = useState<string>('')
	const [searchTerm, setSearchTerm] = useState('')
	const [currentPage, setCurrentPage] = useState(1)
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
	const [cityToDelete, setCityToDelete] = useState<number | null>(null)
	const { showNoti, NotificationComponent } = useNoti()
	const [formData, setFormData] = useState({
		name: '',
		country: '',
		latitude: 0,
		longitude: 0,
		active: true,
	})

	useEffect(() => {
		void fetchCities()
	}, [])

	const fetchCities = async () => {
		try {
			setLoading(true)
			setError(null)
			const data: City[] = await citiesApi.getAll()
			setCities(data)
		} catch (error) {
			console.error('Failed to fetch cities:', error)
			setError('Failed to load cities. Please try again.')
		} finally {
			setLoading(false)
		}
	}

	const handleSubmit = async () => {
		if (editingCity) {
			citiesApi.update(editingCity.id, formData).then(() => {
				fetchCities()
				handleClose()
				showNoti('Your city has been updated successfully!', 'success')
			}).catch((error) => {
				console.error('Failed to update city:', error)
				showNoti('Failed to update city. Please try again.', 'error')
			})
		} else {
			citiesApi.create(formData).then(() => {
				fetchCities()
				handleClose()
				showNoti('Your city has been created successfully!', 'success')
			}).catch((error) => {
				console.error('Failed to create city:', error)
				showNoti('Failed to create city. Please try again.', 'error')
			})
		}
	}

	const handleDeleteClick = (id: number) => {
		setCityToDelete(id)
		setDeleteDialogOpen(true)
	}

	const handleDeleteConfirm = () => {
		if (cityToDelete) {
			citiesApi.delete(cityToDelete).then(() => {
				fetchCities()
				showNoti('City has been deleted successfully!', 'success')
			}).catch((error) => {
				console.error('Failed to delete city:', error)
				showNoti('Failed to delete city. Please try again.', 'error')
			})
		}
		setDeleteDialogOpen(false)
		setCityToDelete(null)
	}

	const handleDeleteCancel = () => {
		setDeleteDialogOpen(false)
		setCityToDelete(null)
	}

	const handleCitySelect = (cityKey: string) => {
		const cityOption = AVAILABLE_CITIES.find(
			c => `${c.name}, ${c.country}` === cityKey,
		)
		if (cityOption) {
			setFormData({
				name: cityOption.name,
				country: cityOption.country,
				latitude: cityOption.latitude,
				longitude: cityOption.longitude,
				active: true,
			})
		}
	}

	const handleOpen = (city?: City) => {
		if (city) {
			setEditingCity(city)
			setSelectedCityOption(`${city.name}, ${city.country}`)
			setFormData({
				name: city.name,
				country: city.country,
				latitude: city.latitude,
				longitude: city.longitude,
				active: city.active,
			})
		} else {
			setEditingCity(null)
			setSelectedCityOption('')
			setFormData({
				name: '',
				country: '',
				latitude: 0,
				longitude: 0,
				active: true,
			})
		}
		setOpen(true)
	}

	const handleClose = () => {
		setOpen(false)
		setEditingCity(null)
	}

	const filteredCities = cities.filter(city => 
		city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
		city.country.toLowerCase().includes(searchTerm.toLowerCase())
	)

	const itemsPerPage = 6
	const totalPages = Math.ceil(filteredCities.length / itemsPerPage)
	const paginatedCities = filteredCities.slice(
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
					<LocationCity color="primary" />
					<Typography variant="h4">Cities & Countries</Typography>
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
					Add City
				</Button>
			</Box>

			{error && (
				<Alert severity="error" sx={{ mb: 2 }}>
					{error}
				</Alert>
			)}

			<TextField
				fullWidth
				placeholder="Search cities by name or country..."
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
						<b>Showing {paginatedCities.length} of {filteredCities.length} cities
						{searchTerm && ` (filtered from ${cities.length} total)`}</b>
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
								<TableCell>Country</TableCell>
								<TableCell>Coordinates</TableCell>
								<TableCell>Status</TableCell>
								<TableCell>Actions</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{paginatedCities.length === 0 ? (
								<TableRow>
									<TableCell colSpan={5} align="center">
										<Typography color="text.secondary">
											{searchTerm ? 'No cities match your search.' : 'No cities found. Click "Add City" to create one.'}
										</Typography>
									</TableCell>
								</TableRow>
							) : (
								paginatedCities.map(city => (
									<TableRow key={city.id}>
										<TableCell>{city.name}</TableCell>
										<TableCell>{city.country}</TableCell>
										<TableCell>
											{city.latitude.toFixed(4)}, {city.longitude.toFixed(4)}
										</TableCell>
										<TableCell>{city.active ? 'Active' : 'Inactive'}</TableCell>
										<TableCell>
											<IconButton onClick={() => handleOpen(city)}>
												<Edit />
											</IconButton>
											<IconButton onClick={() => handleDeleteClick(city.id)}>
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
				<DialogTitle>{editingCity ? 'Edit City' : 'Add New City'}</DialogTitle>
				<DialogContent>
					{!editingCity && (
						<Autocomplete
							options={AVAILABLE_CITIES.map(
								city => `${city.name}, ${city.country}`,
							)}
							value={selectedCityOption}
							onChange={(_, newValue) => {
								setSelectedCityOption(newValue || '')
								if (newValue) handleCitySelect(newValue)
							}}
							renderInput={params => (
								<TextField
									{...params}
									label="Searach your City for autocomple"
									margin="normal"
									fullWidth
								/>
							)}
						/>
					)}

					<TextField
						fullWidth
						label="City Name"
						value={formData.name}
						onChange={e => setFormData({ ...formData, name: e.target.value })}
						margin="normal"
					/>
					<TextField
						fullWidth
						label="Country"
						value={formData.country}
						onChange={e =>
							setFormData({ ...formData, country: e.target.value })
						}
						margin="normal"
					/>
					<TextField
						fullWidth
						label="Latitude"
						type="number"
						value={formData.latitude}
						onChange={e =>
							setFormData({ ...formData, latitude: parseFloat(e.target.value) })
						}
						margin="normal"
					/>
					<TextField
						fullWidth
						label="Longitude"
						type="number"
						value={formData.longitude}
						onChange={e =>
							setFormData({
								...formData,
								longitude: parseFloat(e.target.value),
							})
						}
						margin="normal"
					/>
					<FormControlLabel
						control={
							<Switch
								checked={formData.active}
								onChange={e =>
									setFormData({ ...formData, active: e.target.checked })
								}
							/>
						}
						label="Active"
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
							{editingCity ? 'Update' : 'Create'}
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
						Are you sure you want to delete this city? This action cannot be undone.
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

export default CitiesPage
