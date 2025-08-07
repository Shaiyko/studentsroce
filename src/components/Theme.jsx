// src/components/Theme.js
import { createTheme } from '@mui/material/styles';

const demoTheme = createTheme({
  cssVariables: { colorSchemeSelector: 'class' },
  colorSchemes: {
    light: {
      palette: {
        mode: 'light',
        background: {
          default: '#ffffff',
          paper: '#f8f8f8',
        },
        text: {
          primary: '#000000',
        },
      },
      components: {
        MuiTableCell: {
          styleOverrides: {
            root: {
              backgroundColor: '#ffffff',
              color: '#000000',
            },
          },
        },
      },
    },
    dark: {
      palette: {
        mode: 'dark',
        background: {
          default: '#121212',
          paper: '#1e1e1e',
        },
        text: {
          primary: '#ffffff',
        },
      },
      components: {
        MuiTableCell: {
          styleOverrides: {
            root: {
              backgroundColor: '#1e1e1e',
              color: '#ffffff',
            },
          },
        },
      },
    },
  },
  breakpoints: {
    values: { xs: 0, sm: 600, md: 600, lg: 1200, xl: 1536 },
  },
  typography: {
    fontFamily: 'NotoSansLaoLooped, sans-serif',
  },
});

export default demoTheme;
