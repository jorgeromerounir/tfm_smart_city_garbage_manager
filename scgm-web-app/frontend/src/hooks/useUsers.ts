import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext.tsx'
import { userApi } from '../services/api.ts'
import { Profile, User } from '../types'

export default function useUsers() {
	const [users, setUsers] = useState<User[]>([])
	const [createFormOpen, setCreateFormOpen] = useState(false)
	const [loading, setLoading] = useState(true)
	const { user, canManage } = useAuth()

	useEffect(() => {
		void fetchUsers()
	}, [])

	const fetchUsers = async () => {
		try {
			const allUsers = await userApi.getAll()
			// Filter users based on role permissions
			const filteredUsers = allUsers.filter(u => {
				if (user?.profile === Profile.ADMIN) {
					return u.profile === Profile.SUPERVISOR
				}
				if (user?.profile === Profile.SUPERVISOR) {
					return u.profile === Profile.OPERATOR
				}
				return false
			})
			setUsers(filteredUsers)
		} catch (error) {
			console.error('Failed to fetch users:', error)
		} finally {
			setLoading(false)
		}
	}

	const handleDeleteUser = async (userId: number, userProfile: Profile) => {
		if (!canManage(userProfile)) {
			return
		}

		if (window.confirm('Are you sure you want to delete this user?')) {
			try {
				await userApi.delete(userId)
				void fetchUsers()
			} catch (error) {
				console.error('Failed to delete user:', error)
			}
		}
	}

	const getProfileColor = (profile: Profile) => {
		switch (profile) {
			case Profile.ADMIN:
				return 'error'
			case Profile.SUPERVISOR:
				return 'warning'
			case Profile.OPERATOR:
				return 'info'
			default:
				return 'default'
		}
	}

	const canCreateUsers =
		user?.profile === Profile.ADMIN || user?.profile === Profile.SUPERVISOR

	return {
		users,
		loading,
		createFormOpen,
		setCreateFormOpen,
		canCreateUsers,
		canManage,
		handleDeleteUser,
		getProfileColor,
		fetchUsers,
	}
}
