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
const CONTAINERS_BASE = 'http://localhost:8763/scgm-containers-api'
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

const authApiAxios = axios.create({
	baseURL: AUTH_BASE,
	timeout: 10000,
})
const customersApiAxios = axios.create({
	baseURL: CUSTOMERS_BASE,
	timeout: 10000,
})
const containersApiAxios = axios.create({
	baseURL: CONTAINERS_BASE,
	timeout: 10000,
})

// Add auth token to requests
customersApiAxios.interceptors.request.use(config => {
	const token = localStorage.getItem('accessToken')
	if (token) {
		config.headers.Authorization = `Bearer ${token}`
	}
	return config
})
// Add response interceptor to handle auth errors
customersApiAxios.interceptors.response.use(
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
// Add auth token to requests
containersApiAxios.interceptors.request.use(config => {
	const token = localStorage.getItem('accessToken')
	if (token) {
		config.headers.Authorization = `Bearer ${token}`
	}
	return config
})
// Add response interceptor to handle auth errors
containersApiAxios.interceptors.response.use(
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
	getByCity: (cityId: number): Promise<Container[]> =>
		containersApiAxios.post(`/api/v1/containers/by-city/${cityId}`, {targetMethod: 'GET'}).then(res => res.data),

	getStatusByCity: (cityId: number): Promise<Container[]> =>
		containersApiAxios.post(`/api/v1/containers/status-summary/${cityId}`, {targetMethod: 'GET'}).then(res => res.data),
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
		authApiAxios.post('/api/v1/auth/signin', {targetMethod: 'POST', body: data}).then(res => res.data),

	refresh: (refreshToken: string): Promise<AuthResponse> =>
		authApiAxios.post('/api/v1/auth/refresh', {targetMethod: 'POST', body: { refreshToken }}).then(res => res.data),

	logout: (refreshToken: string): Promise<void> =>
		authApiAxios.post('/api/v1/auth/logout', {targetMethod: 'POST', body: { refreshToken }}).then(res => res.data),
}

export const userApi = {
	getByProfileOperator: (customerId: number): Promise<User[]> =>
		customersApiAxios.post(`/api/v1/users/by-customer/${customerId}/profile-operator}`, {targetMethod: 'GET'}).then(res => res.data),

	getByEmail: (email: string): Promise<User> =>
		customersApiAxios.post(`/api/v1/users/by-email`, {targetMethod: 'GET', queryParams: {email:[email]}}).then(res => res.data),

	getById: (userId: number): Promise<User> =>
		customersApiAxios.post(`/api/v1/users/${userId}`, {targetMethod: 'GET'}).then(res => res.data),

	create: (data: CreateUserRequest, sessionUser: User): Promise<User> => {
		if(Profile.ADMIN == sessionUser.profile) {
			return customersApiAxios.post('/api/v1/users/add-for-admin', {targetMethod: 'POST', body: data}).then(res => res.data)
		} else if (Profile.SUPERVISOR  == sessionUser.profile) {
			return customersApiAxios.post('/api/v1/users/add-for-supervisor', {targetMethod: 'POST', body: data}).then(res => res.data)
		} else {
			return Promise.reject(new Error('No authorized profile'))
		}
	},

	delete: (userId: number): Promise<void> =>
		customersApiAxios.post(`/api/v1/users/${userId}`, {targetMethod: 'DELETE'}).then(res => res.data),
}

export const citiesApi = {
	getByCountry: (country: string): Promise<City[]> =>
		customersApiAxios.post(`/api/v1/cities/by-country/${country}`, {targetMethod: 'GET', queryParams: {}}).then(res => res.data),

	getCountries: (): Promise<CountryDto[]> =>
		customersApiAxios.post(`/api/v1/cities/countries`, {targetMethod: 'GET'}).then(res => res.data),

	create: (data: CityAddDto): Promise<City> =>
		customersApiAxios.post('/api/v1/cities', {targetMethod: 'POST', body: data}).then(res => res.data),

	update: (cityId: number, data: CityAddDto): Promise<City> =>
		customersApiAxios.post(`/api/v1/cities/${cityId}`, {targetMethod: 'PUT', body: data}).then(res => res.data),

	delete: (cityId: number): Promise<void> =>
		customersApiAxios.post(`/api/v1/cities/${cityId}`, {targetMethod: 'DELETE'}).then(res => res.data),
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
