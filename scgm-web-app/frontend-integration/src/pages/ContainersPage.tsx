import { Add, Delete, Edit, Inventory, Search } from '@mui/icons-material'
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
	Grid,
	IconButton,
	InputAdornment,
	InputLabel,
	MenuItem,
	Pagination,
	Paper,
	Select,
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
import { containerApi, citiesApi, zonesApi } from '../services/api'
import { Container, ContainerAddDto, ContainerUpdateDto, City, ZoneDto, WasteLevel } from '../types'
import useNoti from '../hooks/useNoti'
import { useAuth } from '../contexts/AuthContext'
import useCustomer from '../hooks/useCustomer'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import { LatLngExpression } from 'leaflet'

interface LocationPickerProps {
	position: [number, number]
	onLocationSelect: (lat: number, lng: number) => void
}

const LocationPicker: React.FC<LocationPickerProps> = ({ position, onLocationSelect }) => {
	useMapEvents({
		click: (e) => {
			onLocationSelect(e.latlng.lat, e.latlng.lng)
		}
	})
	return position[0] !== 0 || position[1] !== 0 ? <Marker position={position} /> : null
}

const ContainersPage: React.FC = () => {
	const [containers, setContainers] = useState<Container[]>([])
	const [cities, setCities] = useState<City[]>([])
	const [zones, setZones] = useState<ZoneDto[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [open, setOpen] = useState(false)
	const [editingContainer, setEditingContainer] = useState<Container | null>(null)
	const [searchTerm, setSearchTerm] = useState('')
	const [searchInput, setSearchInput] = useState('')
	const [currentPage, setCurrentPage] = useState(1)
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
	const [containerToDelete, setContainerToDelete] = useState<string | null>(null)
	const { showNoti, NotificationComponent } = useNoti()
	
	const { user } = useAuth()
	const { customer } = useCustomer(user?.customerId)
	const [selectedCityId, setSelectedCityId] = useState<number>(customer?.cityId || 1)
	const [selectedZoneId, setSelectedZoneId] = useState<string | undefined>(undefined)
	
	const customerId = customer?.id || 1
	
	const [formData, setFormData] = useState<ContainerAddDto>({
		latitude: 0,
		longitude: 0,
		wasteLevelValue: 0,
		temperature: 0,
		address: '',
		cityId: selectedCityId,
		customerId: customerId,
		zoneId: undefined,
	})

	useEffect(() => {
		if (customer?.cityId) {
			setSelectedCityId(customer.cityId)
		}
	}, [customer?.cityId])

	useEffect(() => {
		setSelectedZoneId(undefined)
		void fetchZones()
	}, [selectedCityId])

	useEffect(() => {
		void fetchContainers()
		void fetchCities()
	}, [selectedCityId, selectedZoneId])

	const fetchContainers = async (searchValue?: string) => {
		try {
			setLoading(true)
			setError(null)
			const addressCoincidence = (searchValue && searchValue.length > 2) ? searchValue : undefined
			const data = await containerApi.findByCustomerCityPaginated(customerId, selectedCityId, { 
				limit: 2000, 
				addressCoincidence: addressCoincidence,
				zoneId: selectedZoneId
			})
			setContainers(data ? data : [])
			setSearchTerm(searchInput)
			setCurrentPage(1)
		} catch (error) {
			console.error('Failed to fetch containers:', error)
			setError('Failed to load containers. Please try again.')
		} finally {
			setLoading(false)
		}
	}

	const fetchCities = async () => {
		try {
			const data = await citiesApi.getAll()
			setCities(data? data: [])
		} catch (error) {
			console.error('Failed to fetch cities:', error)
		}
	}

	const fetchZones = async () => {
		try {
			const data = await zonesApi.getZonesByCustomerIdAndCityId(customerId, selectedCityId)
			setZones(data? data: [])
		} catch (error) {
			console.error('Failed to fetch zones:', error)
		}
	}

	const handleSubmit = async () => {
		if (editingContainer) {
			const updateData: ContainerUpdateDto = {
				latitude: formData.latitude,
				longitude: formData.longitude,
				wasteLevelValue: formData.wasteLevelValue,
				temperature: formData.temperature,
				address: formData.address,
				cityId: formData.cityId,
				customerId: formData.customerId,
				zoneId: formData.zoneId,
			}
			containerApi.update(customerId, editingContainer.id, updateData).then(() => {
				fetchContainers()
				handleClose()
				showNoti('Your container has been updated successfully!', 'success')
			}).catch((error) => {
				console.error('Failed to update container:', error)
				showNoti('Failed to update container. Please try again.', 'error')
			})
		} else {
			containerApi.add(customerId, formData).then(() => {
				fetchContainers()
				handleClose()
				showNoti('Your container has been created successfully!', 'success')
			}).catch((error) => {
				console.error('Failed to create container:', error)
				showNoti('Failed to create container. Please try again.', 'error')
			})
		}
	}

	const handleDeleteClick = (id: string) => {
		setContainerToDelete(id)
		setDeleteDialogOpen(true)
	}

	const handleDeleteConfirm = () => {
		if (containerToDelete) {
			containerApi.delete(customerId, containerToDelete).then(() => {
				fetchContainers()
				showNoti('Container has been deleted successfully!', 'success')
			}).catch((error) => {
				console.error('Failed to delete container:', error)
				showNoti('Failed to delete container. Please try again.', 'error')
			})
		}
		setDeleteDialogOpen(false)
		setContainerToDelete(null)
	}

	const handleDeleteCancel = () => {
		setDeleteDialogOpen(false)
		setContainerToDelete(null)
	}

	const handleOpen = (container?: Container) => {
		if (container) {
			setEditingContainer(container)
			setFormData({
				latitude: container.latitude,
				longitude: container.longitude,
				wasteLevelValue: container.wasteLevelValue,
				temperature: container.temperature,
				address: container.address,
				cityId: container.cityId,
				customerId: container.customerId,
				zoneId: container.zoneId,
			})
		} else {
			setEditingContainer(null)
			setFormData({
				latitude: 0,
				longitude: 0,
				wasteLevelValue: 0,
				temperature: 0,
				address: '',
				cityId: selectedCityId,
				customerId: customerId,
				zoneId: undefined,
			})
		}
		setOpen(true)
	}

	const handleClose = () => {
		setOpen(false)
		setEditingContainer(null)
	}

	const filteredContainers = containers?.filter(container => 
		container.address.toLowerCase().includes(searchTerm.toLowerCase())
	)

	const itemsPerPage = 6
	const totalPages = Math.ceil(filteredContainers.length / itemsPerPage)
	const paginatedContainers = filteredContainers.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	)

	const handleSearch = () => {
		fetchContainers(searchInput)
	}

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			handleSearch()
		}
	}

	const getWasteLevelColor = (level: WasteLevel) => {
		switch (level) {
			case WasteLevel.LIGHT: return '#4caf50'
			case WasteLevel.MEDIUM: return '#ff9800'
			case WasteLevel.HEAVY: return '#f44336'
			default: return '#757575'
		}
	}

	const getSelectedCityCenter = (): [number, number] => {
		const selectedCity = cities.find(city => city.id === formData.cityId)
		return selectedCity ? [selectedCity.latitude, selectedCity.longitude] : [0, 0]
	}

	const handleLocationSelect = (lat: number, lng: number) => {
		setFormData({ ...formData, latitude: lat, longitude: lng })
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
					<Inventory color="primary" />
					<Typography variant="h4">Container Management</Typography>
				</Box>
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
					<FormControl sx={{ minWidth: 200 }}>
						<InputLabel>Zone</InputLabel>
						<Select
							value={selectedZoneId || ''}
							label="Zone"
							onChange={(e) => setSelectedZoneId(e.target.value || undefined)}
						>
							<MenuItem value="">All Zones</MenuItem>
							{zones.map(zone => (
								<MenuItem key={zone.id} value={zone.id}>
									{zone.name}
								</MenuItem>
							))}
						</Select>
					</FormControl>
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
						Add Container
					</Button>
				</Box>
			</Box>

			{error && (
				<Alert severity="error" sx={{ mb: 2 }}>
					{error}
				</Alert>
			)}

			<Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
				<TextField
					fullWidth
					placeholder="Search containers by address (Enter)..."
					value={searchInput}
					onChange={(e) => setSearchInput(e.target.value)}
					onBlur={handleSearch}
					onKeyPress={handleKeyPress}
					InputProps={{
						startAdornment: (
							<InputAdornment position="start">
								<Search />
							</InputAdornment>
						),
					}}
				/>
				<IconButton
					onClick={handleSearch}
					color="primary"
					sx={{ border: '1px solid #ccc', borderRadius: 1, px: 1.5, width: 100 }}
				>
					<Search fontSize="small" />
				</IconButton>
			</Box>

			{!loading && (
				<Box sx={{ mb: 2, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
					<Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold' }}>
						Showing {paginatedContainers.length} of {filteredContainers.length} containers
						{searchTerm && ` (filtered from ${containers.length} total)`}
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
								<TableCell sx={{ fontWeight: 'bold' }}>Address</TableCell>
								<TableCell sx={{ fontWeight: 'bold' }}>Coordinates</TableCell>
								<TableCell sx={{ fontWeight: 'bold' }}>Waste Level</TableCell>
								<TableCell sx={{ fontWeight: 'bold' }}>Temperature</TableCell>
								<TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
								<TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{paginatedContainers.length === 0 ? (
								<TableRow>
									<TableCell colSpan={6} align="center">
										<Typography color="text.secondary">
											{searchTerm ? 'No containers match your search.' : 'No containers found. Click "Add Container" to create one.'}
										</Typography>
									</TableCell>
								</TableRow>
							) : (
								paginatedContainers.map(container => (
									<TableRow key={container.id}>
										<TableCell>{container.address}</TableCell>
										<TableCell>
											{container.latitude.toFixed(4)}, {container.longitude.toFixed(4)}
										</TableCell>
										<TableCell>{container.wasteLevelValue}%</TableCell>
										<TableCell>{container.temperature}°C</TableCell>
										<TableCell>
											<Box
												sx={{
													color: getWasteLevelColor(container.wasteLevelStatus),
													fontWeight: 'bold'
												}}
											>
												{container.wasteLevelStatus}
											</Box>
										</TableCell>
										<TableCell>
											<IconButton onClick={() => handleOpen(container)}>
												<Edit />
											</IconButton>
											<IconButton onClick={() => handleDeleteClick(container.id)}>
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

			{!loading && (
				<Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
					<Pagination
						count={totalPages}
						page={currentPage}
						onChange={(_, page) => setCurrentPage(page)}
						color="primary"
					/>
				</Box>
			)}

			<Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
				<DialogTitle>{editingContainer ? 'Edit Container' : 'Add New Container'}</DialogTitle>
				<DialogContent>
					<Grid container spacing={3}>
						<Grid item xs={6}>
							<TextField
								fullWidth
								label="Address"
								value={formData.address}
								onChange={e => setFormData({ ...formData, address: e.target.value })}
								margin="normal"
							/>
							<TextField
								fullWidth
								label="Latitude"
								type="number"
								value={formData.latitude}
								onChange={e => setFormData({ ...formData, latitude: parseFloat(e.target.value) || 0 })}
								margin="normal"
							/>
							<TextField
								fullWidth
								label="Longitude"
								type="number"
								value={formData.longitude}
								onChange={e => setFormData({ ...formData, longitude: parseFloat(e.target.value) || 0 })}
								margin="normal"
							/>
							<TextField
								fullWidth
								label="Waste Level (%)"
								type="number"
								inputProps={{ min: 0, max: 100 }}
								value={formData.wasteLevelValue}
								onChange={e => setFormData({ ...formData, wasteLevelValue: parseFloat(e.target.value) || 0 })}
								margin="normal"
							/>
							<TextField
								fullWidth
								label="Temperature (°C)"
								type="number"
								value={formData.temperature}
								onChange={e => setFormData({ ...formData, temperature: parseFloat(e.target.value) || 0 })}
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
							<FormControl fullWidth margin="normal">
								<InputLabel>Zone (Optional)</InputLabel>
								<Select
									value={formData.zoneId || ''}
									label="Zone (Optional)"
									onChange={e => setFormData({ ...formData, zoneId: e.target.value || undefined })}
								>
									<MenuItem value="">No Zone</MenuItem>
									{zones.map(zone => (
										<MenuItem key={zone.id} value={zone.id}>
											{zone.name}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</Grid>
						<Grid item xs={6}>
							<Typography variant="subtitle2" sx={{ mb: 1 }}>Click on map to select location</Typography>
							<Box sx={{ height: 400, border: '1px solid #ccc', borderRadius: 1 }}>
								<MapContainer
									center={getSelectedCityCenter() as LatLngExpression}
									zoom={11}
									style={{ height: '100%', width: '100%' }}
									key={`${formData.cityId}-${getSelectedCityCenter()[0]}-${getSelectedCityCenter()[1]}`}
								>
									<TileLayer
										url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
										attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
									/>
									<LocationPicker
										position={[formData.latitude, formData.longitude]}
										onLocationSelect={handleLocationSelect}
									/>
								</MapContainer>
							</Box>
						</Grid>
					</Grid>
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
							{editingContainer ? 'Update' : 'Create'}
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
						Are you sure you want to delete this container? This action cannot be undone.
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

export default ContainersPage