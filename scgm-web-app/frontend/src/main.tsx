import { CssBaseline } from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { SnackbarProvider } from 'notistack'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'

const theme = createTheme({
	palette: {
		primary: {
			main: '#2E7D32',
		},
		secondary: {
			main: '#FF6F00',
		},
	},
})

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<BrowserRouter>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<SnackbarProvider maxSnack={3}>
					<App />
				</SnackbarProvider>
			</ThemeProvider>
		</BrowserRouter>
	</React.StrictMode>,
)
