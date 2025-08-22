import React from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Container, AppBar, Toolbar, Typography, Box, Button, ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import DeleteIcon from '@mui/icons-material/Delete';
import DashboardIcon from '@mui/icons-material/Dashboard';
import RouteIcon from '@mui/icons-material/Route';
import Dashboard from './pages/Dashboard';
import RouteOptimization from './pages/RouteOptimization';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2E7D32',
      light: '#4CAF50',
      dark: '#1B5E20'
    },
    secondary: {
      main: '#FF6F00'
    }
  },
  shape: {
    borderRadius: 12
  }
});

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" role="banner" elevation={0}>
        <Toolbar sx={{ minHeight: 64 }}>
          <DeleteIcon sx={{ mr: 2, fontSize: 28 }} />
          <Typography variant="h6" component="h1" sx={{ flexGrow: 1, fontWeight: 600 }}>
            Urban Waste Monitor
          </Typography>
          
          <Button
            color="inherit"
            startIcon={<DashboardIcon />}
            onClick={() => navigate('/')}
            sx={{
              mr: 2,
              px: 3,
              py: 1,
              borderRadius: 2,
              backgroundColor: location.pathname === '/' ? 'rgba(255,255,255,0.15)' : 'transparent',
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' }
            }}
          >
            Dashboard
          </Button>
          
          <Button
            color="inherit"
            startIcon={<RouteIcon />}
            onClick={() => navigate('/routes')}
            sx={{
              px: 3,
              py: 1,
              borderRadius: 2,
              backgroundColor: location.pathname === '/routes' ? 'rgba(255,255,255,0.15)' : 'transparent',
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' }
            }}
          >
            Routes
          </Button>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="xl" sx={{ mt: 3, mb: 3 }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/routes" element={<RouteOptimization />} />
        </Routes>
      </Container>
    </Box>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppContent />
    </ThemeProvider>
  );
}

export default App;