import React, {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from 'react'
import { useNavigate } from 'react-router-dom'
import { authService, userApi } from '../services/api'
import { Profile, User } from '../types'

interface AuthContextType {
	user: User | null
	isAuthenticated: boolean
	signIn: (email: string, password: string) => Promise<void>
	signOut: () => void
	hasRole: (role: Profile) => boolean
	canManage: (targetRole: Profile) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
	const context = useContext(AuthContext)
	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider')
	}
	return context
}

interface AuthProviderProps {
	children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const [user, setUser] = useState<User | null>(null)
	const [isAuthenticated, setIsAuthenticated] = useState(false)
	const navigate = useNavigate()

	useEffect(() => {
		const token = localStorage.getItem('accessToken')
		const userEmail = localStorage.getItem('userEmail')
		if (token && userEmail) {
			//TODO: Validate functionality
			void fetchUserByEmail(userEmail)
		}
	}, [])

	const fetchUserByEmail = async (email: string) => {
		try {
			console.log('fetchUserByEmail: ', email)
			const currentUser = await userApi.getByEmail(email)
			if (currentUser) {
				setUser(currentUser)
				setIsAuthenticated(true)
				// Don't navigate - stay on current route
			}
		} catch (error) {
			console.error('Failed to fetch user:', error)
		}
	}

	const signIn = async (email: string, password: string) => {
		const response = await authService.signIn({ email, password })
		localStorage.setItem('accessToken', response.accessToken)
		localStorage.setItem('refreshToken', response.refreshToken)
		localStorage.setItem('userEmail', email)

		await fetchUserByEmail(email)
		navigate('/dashboard')
	}

	const signOut = () => {
		const refreshToken = localStorage.getItem('refreshToken')
		if (refreshToken) {
			authService.logout(refreshToken).catch(console.error)
		}

		localStorage.removeItem('accessToken')
		localStorage.removeItem('refreshToken')
		localStorage.removeItem('userEmail')
		setUser(null)
		setIsAuthenticated(false)
		navigate('/')
	}

	const hasRole = (role: Profile): boolean => {
		return user?.profile === role
	}

	const canManage = (targetRole: Profile): boolean => {
		if (!user) return false

		if (user.profile === Profile.ADMIN) {
			return targetRole === Profile.SUPERVISOR || targetRole === Profile.OPERATOR
		}

		return (
			user.profile === Profile.SUPERVISOR && targetRole === Profile.OPERATOR
		)
	}

	return (
		<AuthContext.Provider
			value={{
				user,
				isAuthenticated,
				signIn,
				signOut,
				hasRole,
				canManage,
			}}
		>
			{children}
		</AuthContext.Provider>
	)
}
