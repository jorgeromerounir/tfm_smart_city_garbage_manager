// Added to API
export enum WasteLevel {
	LIGHT = 'LIGHT',
	MEDIUM = 'MEDIUM',
	HEAVY = 'HEAVY',
}

// Added to API
export interface Container {
	id: string
	latitude: number
	longitude: number
	temperature: number
	wasteLevelValue: number
	wasteLevelStatus: WasteLevel
	address: string
	cityId: number
	customerId: number
	createdAt: string
	updatedAt: string
	zoneId?: string
}

// Added to API
export interface StatusSummary {
	light: number
	medium: number
	heavy: number
	total: number
}

export interface RoutePoint {
	lat: number
	lng: number
	id: string
	priority: number
}

export interface OptimizedRoute {
	routes: VRPRoute[]
	totalDistance: number
	containerCount: number
	estimatedTime: number
	trucksUsed: number
}

export interface VRPRoute {
	truckId: string
	truckName: string
	points: RoutePoint[]
}

export interface Truck {
	id: string
	name: string
	licensePlate: string
	capacity: number
	city: string
	available: boolean
	createdAt: string
	updatedAt: string
}

export enum AssignmentStatus {
	UNASSIGNED = 'UNASSIGNED',
	PENDING = 'PENDING',
	IN_PROGRESS = 'IN_PROGRESS',
	COMPLETED = 'COMPLETED',
	CANCELLED = 'CANCELLED',
}

export interface RouteAssignment {
	id: string
	routeName: string
	routeData: OptimizedRoute
	truckId: string
	operatorId: string
	supervisorId: string
	city: string
	status: AssignmentStatus
	createdAt: string
	updatedAt: string
}

export interface SavedRoute extends OptimizedRoute {
	id: string
	name: string
	city: string
	createdAt: string
	updatedAt?: string
	operatorName?: string
	operatorId?: string
	truckId?: string
	truckName?: string
	status?: 'pending' | 'in_progress' | 'completed'
	assignedAt?: string
}

export enum Profile {
	ADMIN = 'ADMIN',
	SUPERVISOR = 'SUPERVISOR',
	OPERATOR = 'OPERATOR',
}

export interface User {
	id: number
	customerId: number
	name: string
	email: string
	profile: Profile
	country?: string
	createdAt: string
	updatedAt: string
}

export interface AuthResponse {
	accessToken: string
	refreshToken: string
}

export interface SignInRequest {
	email: string
	password: string
}

export interface CreateUserRequest {
	name: string
	email: string
	password: string
	profile: Profile
	customerId: number
	country?: string
}

// Added to API
export interface City {
	id: number
	name: string
	country: string
	latitude: number
	longitude: number
	active: boolean
	createdAt: string
	updatedAt: string
}

export interface CityAddDto {
    name: string
    country: string
    latitude: number
    longitude: number
    active: boolean
}

//TODO: Use
export interface CountryDto {
	code: string
	name: string
}

export interface Customer {
  id: number
  name: string
  description: string
  cityId: number
  createdAt: string
  updatedAt: string
  active: boolean
}

export interface ZoneAddDto {
  centerLatitude: number
  centerLongitude: number
  name: string
  cityId: number
  customerId: number
  startLat: number
  startLng: number
  endLat: number
  endLng: number
  description?: string
  color: string
}

export interface ZoneDto {
  id: string
  centerLatitude: number
  centerLongitude: number
  name: string
  cityId: number
  customerId: number
  startLat: number
  startLng: number
  endLat: number
  endLng: number
  description?: string
  color: string
  createdAt: string
  updatedAt: string
}

export interface ContainerZoneUpdateDto {
  containerId: string
  zoneId: string
}

export interface OptimizeRouteDto {
  cityId: number
  zoneId: string
  startLat: number
  startLng: number
  wasteTypes?: WasteLevel[]
}

export interface TruckDto {
  id: string
  name: string
  licensePlate: string
  capacity: number
  cityId: number
  customerId: number
  available: boolean
  createdAt: string
  updatedAt: string
}

export interface TruckAddDto {
  name: string
  licensePlate: string
  capacity: number
  cityId: number
  customerId: number
  available: boolean
}

export interface TruckUpdateDto {
  name: string
  licensePlate: string
  capacity: number
  available: boolean
}

export interface TruckSearchParams {
  available?: boolean
  nameCoincidence?: string
  limit?: number
}

export interface City {
	id: number
	name: string
	country: string
	latitude: number
	longitude: number
	active: boolean
	createdAt: string
	updatedAt: string
}

