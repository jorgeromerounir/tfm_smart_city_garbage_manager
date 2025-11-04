import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Profile } from '../types'

interface ProtectedRouteProps {
	children: React.ReactNode
	requiredRole?: Profile
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
	children,
	requiredRole,
}) => {
	const { isAuthenticated, user } = useAuth()

	
	/*if (!isAuthenticated) {
		console.log('----> ProtectedRoute isAuthenticated: ', isAuthenticated)
		return <Navigate to="/login" replace />
	}

	if (
		requiredRole &&
		user?.profile !== requiredRole &&
		user?.profile !== Profile.ADMIN
	) {
		console.log('----> Naviqugate raro')
		return <Navigate to="/" replace />
	}*/

	return <>{children}</>
}

export default ProtectedRoute
