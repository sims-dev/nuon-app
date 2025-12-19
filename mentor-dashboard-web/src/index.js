
import { createRoot } from 'react-dom/client';
import React from 'react';
import App from './App';
import { ThemeProvider, CssBaseline } from '@mui/material';
import neonTheme from './neonTheme';
import { AuthProvider } from './AuthContext';
import { SocketProvider } from './SocketContext';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
	<ThemeProvider theme={neonTheme}>
		<CssBaseline />
		<AuthProvider>
			<SocketProvider>
				<App />
			</SocketProvider>
		</AuthProvider>
	</ThemeProvider>
);
