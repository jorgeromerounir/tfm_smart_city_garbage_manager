export enum WasteLevel {
	LIGHT = 'light',
	MEDIUM = 'medium',
	HEAVY = 'heavy',
}

export interface Container {
	id: string // dkaihrkjsandkndksad || BOG000125
	latitude: number // 1738174832
	longitude: number // 23643267432
	wasteLevel: WasteLevel
	temperature: number
	address?: string
	city?: string
	createdAt: string // cuano se instaló
	updatedAt: string // cuando se actulaiza el estado
	// container separated by 500mt
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
	route: RoutePoint[]
	totalDistance: number
	containerCount: number
	estimatedTime: number
}

export interface SavedRoute extends OptimizedRoute {
	id: string
	name: string
	city: string
	createdAt: string
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
