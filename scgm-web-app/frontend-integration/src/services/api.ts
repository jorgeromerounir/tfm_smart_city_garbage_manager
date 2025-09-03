import axios from 'axios'
import {
	AssignmentStatus,
	AuthResponse,
	Container,
	Profile,
	CreateUserRequest,
	OptimizedRoute,
	RouteAssignment,
	SignInRequest,
	StatusSummary,
	Truck,
	User,
	City,
	CityAddDto,
	CountryDto,
	WasteLevel,
} from '../types'

const API_BASE = 'http://localhost:3001'
const AUTH_BASE = 'http://localhost:8763/scgm-auth-service'
const CUSTOMERS_BASE = 'http://localhost:8763/scgm-customers-api'

const api = axios.create({
	baseURL: API_BASE,
	timeout: 10000,
})

// Add auth token to main API requests
api.interceptors.request.use(config => {
	const token = localStorage.getItem('accessToken')
	if (token) {
		config.headers.Authorization = `Bearer ${token}`
	}
	return config
})

// Add response interceptor to handle auth errors
api.interceptors.response.use(
	response => response,
	error => {
		if (error.response?.status === 401) {
			console.error('Authentication failed:', error)
			return Promise.reject(error)
		}
		return Promise.reject(error)
	}
)

const authApi = axios.create({
	baseURL: AUTH_BASE,
	timeout: 10000,
})

const customersApi = axios.create({
	baseURL: CUSTOMERS_BASE,
	timeout: 10000,
})

// Add auth token to requests
customersApi.interceptors.request.use(config => {
	const token = localStorage.getItem('accessToken')
	if (token) {
		config.headers.Authorization = `Bearer ${token}`
	}
	return config
})

// Add response interceptor to handle auth errors
customersApi.interceptors.response.use(
	response => response,
	error => {
		if (error.response?.status === 401) {
			// Don't redirect, just log the error
			console.error('Authentication failed:', error)
			return Promise.reject(error)
		}
		return Promise.reject(error)
	}
)

export const containerApi = {
	getAll: async (city?: string): Promise<Container[]> => {
		const params = city ? { city } : {}
		const res = await api.get('/containers', { params })
		return res.data
	},

	getStatus: async (city?: string): Promise<StatusSummary> => {
		const params = city ? { city } : {}
		const res = await api.get('/containers/status', { params })
		return res.data
	},
}

export const routeApi = {
	optimize: (data: {
		startLat: number
		startLng: number
		endLat: number
		endLng: number
		city: string
		wasteTypes?: WasteLevel[]
	}): Promise<OptimizedRoute> =>
		api.post('/routes/optimize', data).then(res => res.data),

	generateGoogleMapsUrl: (points: { lat: number; lng: number }[]): string => {
		if (points.length === 0) return ''
		const origin = `${points[0].lat},${points[0].lng}`
		const destination = `${points[points.length - 1].lat},${points[points.length - 1].lng}`
		const waypoints = points.slice(1, -1).map(p => `${p.lat},${p.lng}`).join('|')
		return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&waypoints=${waypoints}&travelmode=driving`
	},

	generateWazeUrl: (points: { lat: number; lng: number }[]): string => {
		if (points.length === 0) return ''
		const destination = points[points.length - 1]
		return `https://waze.com/ul?ll=${destination.lat}%2C${destination.lng}&navigate=yes`
	},
}

export const authService = {
	signIn: (data: SignInRequest): Promise<AuthResponse> =>
		authApi.post('/auth/signin', {targetMethod: 'POST', body: data}).then(res => res.data),

	refresh: (refreshToken: string): Promise<AuthResponse> =>
		authApi.post('/auth/refresh', {targetMethod: 'POST', body: { refreshToken }}).then(res => res.data),

	logout: (refreshToken: string): Promise<void> =>
		authApi.post('/auth/logout', {targetMethod: 'POST', body: { refreshToken }}).then(res => res.data),
}

export const userApi = {
	getByProfile: (customerId: number, profile: Profile): Promise<User[]> =>
		customersApi.post(`/api/v1/users/by-customer/${customerId}/profile/${profile}`, {targetMethod: 'GET'}).then(res => res.data),

	getByEmail: (email: string): Promise<User> =>
		customersApi.post(`/api/v1/users/by-email`, {targetMethod: 'GET', queryParams: {email:[email]}}).then(res => res.data),

	getById: (userId: number): Promise<User> =>
		customersApi.post(`/api/v1/users/${userId}`, {targetMethod: 'GET'}).then(res => res.data),

	create: (data: CreateUserRequest): Promise<User> =>
		customersApi.post('/api/v1/users', {targetMethod: 'POST', body: data}).then(res => res.data),

	delete: (userId: number): Promise<void> =>
		customersApi.post(`/api/v1/users/${userId}`, {targetMethod: 'DELETE'}).then(res => res.data),
}

export const citiesApi = {
	getByCountry: (country: string): Promise<City[]> =>
		customersApi.post(`/api/v1/cities/by-country`, {targetMethod: 'GET', queryParams: {country:[country]}}).then(res => res.data),

	getCountries: (): Promise<CountryDto[]> =>
		customersApi.post(`/api/v1/cities/countries`, {targetMethod: 'GET'}).then(res => res.data),

	create: (data: CityAddDto): Promise<City> =>
		customersApi.post('/api/v1/cities', {targetMethod: 'POST', body: data}).then(res => res.data),

	update: (cityId: number, data: CityAddDto): Promise<City> =>
		customersApi.post(`/api/v1/cities/${cityId}`, {targetMethod: 'PUT', body: data}).then(res => res.data),

	delete: (cityId: number): Promise<void> =>
		customersApi.post(`/api/v1/cities/${cityId}`, {targetMethod: 'DELETE'}).then(res => res.data),
}

export const truckApi = {
	getAll: (city?: string): Promise<Truck[]> => {
		const params = city ? { city } : {}
		return api.get('/routes/trucks', { params }).then(res => res.data)
	},
	create: (data: {
		name: string
		licensePlate: string
		capacity: number
		city: string
	}): Promise<Truck> =>
		api.post('/routes/trucks', data).then(res => res.data),
}

export const assignmentApi = {
	assign: (data: {
		routeName: string
		routeData: OptimizedRoute
		truckId: string
		operatorId: string
		supervisorId: string
		city: string
	}): Promise<RouteAssignment> =>
		api.post('/routes/assign', data).then(res => res.data),

	getAll: (operatorId?: string): Promise<RouteAssignment[]> => {
		const params = operatorId ? { operatorId } : {}
		return api.get('/routes/assignments', { params }).then(res => res.data)
	},

	updateStatus: (id: string, status: AssignmentStatus): Promise<RouteAssignment> =>
		api.put(`/routes/assignments/${id}/status`, { status }).then(res => res.data),
}
