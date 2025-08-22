import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import App from './App';

const theme = createTheme();

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        {component}
      </ThemeProvider>
    </BrowserRouter>
  );
};

test('renders app title', () => {
  renderWithProviders(<App />);
  const titleElement = screen.getByText(/Urban Waste Monitor/i);
  expect(titleElement).toBeInTheDocument();
});

test('renders navigation tabs', () => {
  renderWithProviders(<App />);
  const dashboardTab = screen.getByText(/Dashboard/i);
  const routeTab = screen.getByText(/Route Optimization/i);
  
  expect(dashboardTab).toBeInTheDocument();
  expect(routeTab).toBeInTheDocument();
});

test('has accessible navigation', () => {
  renderWithProviders(<App />);
  const navigation = screen.getByRole('tablist');
  expect(navigation).toBeInTheDocument();
});