import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Tabs, Tab, Box, Paper } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import RouteIcon from '@mui/icons-material/Route';

function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleChange = (event, newValue) => {
    navigate(newValue);
  };
  
  return (
    <Paper elevation={2} sx={{ borderRadius: 0, mb: 2 }}>
      <Tabs 
        value={location.pathname} 
        onChange={handleChange}
        aria-label="navigation tabs"
        variant="fullWidth"
        indicatorColor="primary"
        textColor="primary"
        sx={{
          '& .MuiTab-root': {
            minHeight: 72,
            fontSize: '1rem',
            fontWeight: 600,
            textTransform: 'none',
            '&:hover': {
              backgroundColor: 'rgba(25, 118, 210, 0.04)'
            }
          },
          '& .MuiTabs-indicator': {
            height: 3
          }
        }}
      >
        <Tab 
          icon={<DashboardIcon sx={{ fontSize: 28 }} />} 
          label="Dashboard" 
          value="/" 
          aria-label="View waste container dashboard"
          iconPosition="top"
        />
        <Tab 
          icon={<RouteIcon sx={{ fontSize: 28 }} />} 
          label="Route Optimization" 
          value="/routes"
          aria-label="Optimize collection routes"
          iconPosition="top"
        />
      </Tabs>
    </Paper>
  );
}

export default Navigation;