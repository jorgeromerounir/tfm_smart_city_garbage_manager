export enum WasteLevel {
	LIGHT = 'light',
	MEDIUM = 'medium',
	HEAVY = 'heavy',
}

export interface Container {
	id: string
	latitude: number
	longitude: number
	wasteLevel: WasteLevel
	temperature: number
	address?: string
	city?: string
	createdAt: string
	updatedAt: string
}

export interface StatusSummary {
	light: number
	medium: number
	heavy: number
	total: number
}

export interface RoutePoint {
	lat: number
	lng: number
	id?: string
}

export interface OptimizedRoute {
	route?: RoutePoint[]
	routes?: VRPRoute[]
	totalDistance: number
	containerCount: number
	estimatedTime: number
	trucksUsed?: number
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
	PENDING = 'pending',
	IN_PROGRESS = 'in_progress',
	COMPLETED = 'completed',
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
	country?: string
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
