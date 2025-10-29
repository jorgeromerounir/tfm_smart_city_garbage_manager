import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios'
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
	Customer,
} from '../types'

const API_BASE = 'http://localhost:3001'
const CONTAINERS_BASE = 'http://localhost:8763/scgm-containers-api'
const AUTH_BASE = 'http://localhost:8763/scgm-auth-service'
const CUSTOMERS_BASE = 'http://localhost:8763/scgm-customers-api'
const ROUTES_BASE = 'http://localhost:8763/scgm-routes-api'

const apiBaseAxios = axios.create({
	baseURL: API_BASE,
	timeout: 10000,
})
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
const routesApiAxios = axios.create({
	baseURL: ROUTES_BASE,
	timeout: 10000,
})

const authReqInterceptor = (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
};

const handleReqError = (error: any) => {
	console.log('Generic handleReqError: ', error)
    return Promise.reject(error);
};

const handleResSuccess = (response: AxiosResponse) => {
    return response;
};

const handleResError = (error: any) => {
    if (error.response?.status === 401) {
		// Don't redirect, just log the error
        console.error('Authentication failed:', error);
		return Promise.reject(error)
    }
    return Promise.reject(error);
};

// Add interceptors to apiBaseAxios
apiBaseAxios.interceptors.request.use(authReqInterceptor, handleReqError)
apiBaseAxios.interceptors.response.use(handleResSuccess, handleResError)
// Add interceptors to authApiAxios
authApiAxios.interceptors.request.use(authReqInterceptor, handleReqError)
authApiAxios.interceptors.response.use(handleResSuccess, handleResError)
// Add interceptors to customersApiAxios
customersApiAxios.interceptors.request.use(authReqInterceptor, handleReqError)
customersApiAxios.interceptors.response.use(handleResSuccess, handleResError)
// Add interceptors to containersApiAxios
containersApiAxios.interceptors.request.use(authReqInterceptor, handleReqError)
containersApiAxios.interceptors.response.use(handleResSuccess, handleResError)
// Add interceptors to routesApiAxios
routesApiAxios.interceptors.request.use(authReqInterceptor, handleReqError)
routesApiAxios.interceptors.response.use(handleResSuccess, handleResError)

export const containerApi = {
	getByCity: (cityId: number): Promise<Container[]> =>
		containersApiAxios.post(`/api/v1/containers/by-city/${cityId}`, {targetMethod: 'GET'}).then(res => res.data),
	
	getByCustomerAndCity: (customerId: number, cityId: number): Promise<Container[]> =>
		containersApiAxios.post(`/api/v1/containers/by-customer/${customerId}/city/${cityId}`, {targetMethod: 'GET'}).then(res => res.data),

	getStatusByCity: (cityId: number): Promise<Container[]> =>
		containersApiAxios.post(`/api/v1/containers/status-summary/${cityId}`, {targetMethod: 'GET'}).then(res => res.data),
}

export const routeApi = {
	/*optimize: (data: {
		startLat: number
		startLng: number
		endLat: number
		endLng: number
		city: string
		wasteTypes?: WasteLevel[]
	}): Promise<OptimizedRoute> =>
		apiBaseAxios.post('/routes/optimize', data).then(res => res.data),*/
	optimize: (customerId: number, data: {
		startLat: number
		startLng: number
		endLat: number
		endLng: number
		cityId: number
		wasteTypes?: WasteLevel[]
	}): Promise<OptimizedRoute> =>
		routesApiAxios.post(`/api/v1/routes/optimize-by-customer/${customerId}`, {targetMethod: 'POST', body: data}).then(res => res.data),

	/*signIn: (data: SignInRequest): Promise<AuthResponse> =>
		authApiAxios.post('/api/v1/auth/signin', {targetMethod: 'POST', body: data}).then(res => res.data),*/

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

export const customersApi = {
	getById: (customerId: number): Promise<Customer> =>
		customersApiAxios.post(`/api/v1/customers/${customerId}`, {targetMethod: 'GET'}).then(res => res.data),	
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
		return apiBaseAxios.get('/routes/trucks', { params }).then(res => res.data)
	},
	create: (data: {
		name: string
		licensePlate: string
		capacity: number
		city: string
	}): Promise<Truck> =>
		apiBaseAxios.post('/routes/trucks', data).then(res => res.data),
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
		apiBaseAxios.post('/routes/assign', data).then(res => res.data),

	getAll: (operatorId?: string): Promise<RouteAssignment[]> => {
		const params = operatorId ? { operatorId } : {}
		return apiBaseAxios.get('/routes/assignments', { params }).then(res => res.data)
	},

	updateStatus: (id: string, status: AssignmentStatus): Promise<RouteAssignment> =>
		apiBaseAxios.put(`/routes/assignments/${id}/status`, { status }).then(res => res.data),
}
