import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext.tsx'
import { userApi } from '../services/api.ts'
import { Profile, User } from '../types/index.ts'


const CUSTOMERS: Customer[] = [
	{
		id: 1,
		name: "Admin Customer",
		description: "Admin Customer",
		cityId: 1,
		active: true,
		createdAt: "2024-01-01T00:00:00Z",
		updatedAt: "2024-01-01T00:00:00Z"
	}
]

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
			const allUsers = await userApi.findByCustomerId(1)
			//const allUsers:any[] = []
			// Filter users based on role permissions
			if (!allUsers) {
				setUsers([])
				return
			}
			const filteredUsers = allUsers.filter(u => {
				if (user?.profile === Profile.ADMIN) {
					return true // Admins can see all users
				}
				if (user?.profile === Profile.SUPERVISOR) {
					return u.profile === Profile.OPERATOR || u.profile === Profile.SUPERVISOR
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
