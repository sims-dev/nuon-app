import { createTheme } from '@mui/material/styles';

const neonTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00fff7', // Neon cyan
      contrastText: '#101010',
    },
    secondary: {
      main: '#ff00ea', // Neon magenta
    },
    background: {
      default: '#101010',
      paper: '#181818',
    },
    text: {
      primary: '#fff',
      secondary: '#00fff7',
    },
    success: {
      main: '#39ff14', // Neon green
    },
    warning: {
      main: '#f7b500', // Neon yellow
    },
    error: {
      main: '#ff1744', // Neon red
    },
    info: {
      main: '#00b0ff', // Neon blue
    },
  },
  typography: {
    fontFamily: 'Montserrat, Arial, sans-serif',
    h2: {
      fontWeight: 800,
      letterSpacing: 1,
    },
    h4: {
      fontWeight: 700,
    },
    button: {
      fontWeight: 700,
      textTransform: 'none',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0 0 8px #00fff7',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: '1px solid #00fff7',
          boxShadow: '0 0 16px #00fff733',
        },
      },
    },
  },
});

export default neonTheme;
