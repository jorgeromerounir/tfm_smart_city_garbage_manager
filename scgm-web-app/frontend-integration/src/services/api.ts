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
	User,
	City,
	CityAddDto,
	CountryDto,
	Customer,
	ZoneAddDto,
	ZoneDto,
	OptimizeRouteDto,
	TruckAddDto,
	TruckDto,
	TruckSearchParams,
	TruckUpdateDto,
	ContainerZoneUpdateDto,
	ContainerAddDto,
	ContainerUpdateDto,
	ContainerSearchParamsDto,
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
	getByCustomerAndCity: (customerId: number, cityId: number, limit:number = 500, 
		hasZoneId?: string): Promise<Container[]> =>
		containersApiAxios.post(`/api/v1/containers/by-customer/${customerId}/city/${cityId}`, 
			{targetMethod: 'GET', queryParams: {limit:[limit], 
				hasZoneId:[!hasZoneId ? null : (hasZoneId == 'true')]}})
				.then(res => res.data),

	getStatusByCity: (customerId: number, cityId: number): Promise<StatusSummary> =>
		containersApiAxios.post(`/api/v1/containers/by-customer/${customerId}/status-summary/${cityId}`, 
			{targetMethod: 'GET'}).then(res => res.data),

	updateMultipleZonesId: (customerId: number, data: ContainerZoneUpdateDto[]): Promise<void> =>
		containersApiAxios.post(`/api/v1/containers/by-customer/${customerId}/multiple-zones`, 
			{targetMethod: 'PUT', body: data}).then(res => res.data),

	//new services
	add: (customerId: number, data: ContainerAddDto): Promise<Container> =>
		containersApiAxios.post(`/api/v1/containers/by-customer/${customerId}`, 
			{targetMethod: 'POST', body: data}).then(res => res.data),

	findById: (customerId: number, containerId: string): Promise<Container> =>
		containersApiAxios.post(`/api/v1/containers/by-customer/${customerId}/container/${containerId}`, 
			{targetMethod: 'GET'}).then(res => res.data),
	
	findByCustomerCityPaginated: (customerId: number, cityId: number, params: ContainerSearchParamsDto = {}): Promise<Container[]> =>
		containersApiAxios.post(`/api/v1/containers/by-customer/${customerId}/city/${cityId}/paginated`, 
			{targetMethod: 'GET', queryParams: (() => {
				const qp: any = {};
				if (params.addressCoincidence)
					qp.addressCoincidence = [params.addressCoincidence];
				if (params.zoneId)
					qp.zoneId = [params.zoneId];
				if (params.limit)
					qp.limit = [params.limit];
				return qp;
			})()})
			.then(res => res.data),
	
	update: (customerId: number, containerId: string, data: ContainerUpdateDto): Promise<Container> =>
		containersApiAxios.post(`/api/v1/containers/by-customer/${customerId}/container/${containerId}`, 
			{targetMethod: 'PUT', body: data}).then(res => res.data),

	delete: (customerId: number, containerId: string): Promise<void> =>
		containersApiAxios.post(`/api/v1/containers/by-customer/${customerId}/container/${containerId}`, 
			{targetMethod: 'DELETE'}).then(res => res.data),
}

export const zonesApi = {
	addMultipleZones: (customerId: number, data: ZoneAddDto[]): Promise<ZoneDto[]> =>
		containersApiAxios.post(`/api/v1/zones/multiple/by-customer/${customerId}`, 
			{targetMethod: 'POST', body: data}).then(res => res.data),

	getZonesByCustomerIdAndCityId: (customerId: number, cityId: number): Promise<ZoneDto[]> =>
		containersApiAxios.post(`/api/v1/zones/by-customer/${customerId}/city/${cityId}`, 
			{targetMethod: 'GET'}).then(res => res.data),

	deleteZone: (customerId: number, zoneId: string): Promise<void> =>
		containersApiAxios.post(`/api/v1/zones/by-customer/${customerId}/zone-id/${zoneId}`, 
			{targetMethod: 'DELETE'}).then(res => res.data),

}

export const routeApi = {
	optimize: (customerId: number, data: OptimizeRouteDto): Promise<OptimizedRoute> =>
		routesApiAxios.post(`/api/v1/routes/optimize/by-customer/${customerId}`, {targetMethod: 'POST', body: data}).then(res => res.data),

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

	getAll: (): Promise<City[]> =>
		customersApiAxios.post(`/api/v1/cities`, {targetMethod: 'GET', queryParams: {}}).then(res => res.data),

	getCountries: (): Promise<CountryDto[]> =>
		customersApiAxios.post(`/api/v1/cities/countries`, {targetMethod: 'GET'}).then(res => res.data),

	create: (data: CityAddDto): Promise<City> =>
		customersApiAxios.post('/api/v1/cities', {targetMethod: 'POST', body: data}).then(res => res.data),

	update: (cityId: number, data: CityAddDto): Promise<City> =>
		customersApiAxios.post(`/api/v1/cities/${cityId}`, {targetMethod: 'PUT', body: data}).then(res => res.data),

	delete: (cityId: number): Promise<void> =>
		customersApiAxios.post(`/api/v1/cities/${cityId}`, {targetMethod: 'DELETE'}).then(res => res.data),

	getById: (cityId: number): Promise<City> =>
		customersApiAxios.post(`/api/v1/cities/${cityId}`, {targetMethod: 'GET'}).then(res => res.data),
}

export const truckApi = {
	add: (customerId: number, data: TruckAddDto): Promise<TruckDto> =>
		routesApiAxios.post(`/api/v1/trucks/by-customer/${customerId}`, 
			{targetMethod: 'POST', body: data}).then(res => res.data),

	findById: (customerId: number, truckId: string): Promise<TruckDto> =>
		routesApiAxios.post(`/api/v1/trucks/by-customer/${customerId}/truck/${truckId}`, 
			{targetMethod: 'GET'}).then(res => res.data),
	
	findByCustomerCity: (customerId: number, cityId: number, params: TruckSearchParams = {}): Promise<TruckDto[]> =>
		routesApiAxios.post(`/api/v1/trucks/by-customer/${customerId}/city/${cityId}`, 
			{targetMethod: 'GET', queryParams: {
				available: [ params.available !== undefined ? params.available : null],
				nameCoincidence: [ params.nameCoincidence || null],
				limit: [ params.limit || null]
			}})
			.then(res => res.data),
	
	update: (customerId: number, truckId: string, data: TruckUpdateDto): Promise<TruckDto> =>
		routesApiAxios.post(`/api/v1/trucks/by-customer/${customerId}/truck/${truckId}`, 
			{targetMethod: 'PUT', body: data}).then(res => res.data),

	delete: (customerId: number, truckId: string): Promise<void> =>
		routesApiAxios.post(`/api/v1/trucks/by-customer/${customerId}/truck/${truckId}`, 
			{targetMethod: 'DELETE'}).then(res => res.data),
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
