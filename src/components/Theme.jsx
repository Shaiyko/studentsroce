// src/components/Theme.js
import { createTheme } from '@mui/material/styles';

const demoTheme = createTheme({
  colorSchemes: { light: true, dark: true },
  cssVariables: { colorSchemeSelector: 'class' },
  breakpoints: {
    values: { xs: 0, sm: 600, md: 600, lg: 1200, xl: 1536 },
  },
  typography: {
    fontFamily: "NotoSansLaoLooped, sans-serif",
  },
});

export default demoTheme;
