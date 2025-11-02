import {
	AccountCircle,
	Dashboard,
	LocationCity,
	People,
	Route,
	MapRounded,
} from '@mui/icons-material'
import {
	AppBar,
	Box,
	Button,
	Menu,
	MenuItem,
	Toolbar,
	Typography,
} from '@mui/material'
import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Profile } from '../types'
import SignInForm from './SignInForm'

const Navbar: React.FC = () => {
	const location = useLocation()
	const { user, isAuthenticated, signOut } = useAuth()
	const [signInOpen, setSignInOpen] = useState(false)
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

	const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget)
	}

	const handleUserMenuClose = () => {
		setAnchorEl(null)
	}

	const handleSignOut = () => {
		signOut()
		handleUserMenuClose()
	}

	const canAccessUsers =
		user?.profile === Profile.ADMIN || user?.profile === Profile.SUPERVISOR

	return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Smart City Garbage Manager (SCGM)
          </Typography>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Button
              color="inherit"
              component={Link}
              to="/dashboard"
              startIcon={<Dashboard />}
              variant={location.pathname === "/dashboard" ? "outlined" : "text"}
            >
              Dashboard
            </Button>

            {isAuthenticated && canAccessUsers && (
              <>
				{user?.profile === Profile.ADMIN && (
                  <Button
                    color="inherit"
                    component={Link}
                    to="/cities"
                    startIcon={<LocationCity />}
                    variant={location.pathname === "/cities" ? "outlined" : "text"}
                  >
                    Cities
                  </Button>
                )}
                <Button
                  color="inherit"
                  component={Link}
                  to="/zones"
                  startIcon={<MapRounded />}
                  variant={location.pathname === "/zones" ? "outlined" : "text"}
                >
                  Zones
                </Button>
				<Button
                  color="inherit"
                  component={Link}
                  to="/routes"
                  startIcon={<Route />}
                  variant={location.pathname === "/routes" ? "outlined" : "text"}
                >
                  Routes
                </Button>
                <Button
                  color="inherit"
                  component={Link}
                  to="/users"
                  startIcon={<People />}
                  variant={location.pathname === "/users" ? "outlined" : "text"}
                >
                  Users
                </Button>
                
              </>
            )}

            <Button color="inherit" startIcon={<AccountCircle />} onClick={handleUserMenuOpen}>
              {user?.name}
            </Button>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleUserMenuClose}>
              <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <SignInForm open={signInOpen} onClose={() => setSignInOpen(false)} />
    </>
  );
}

export default Navbar
