import { createTheme } from "@mui/material";

export const lightTheme = createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#673ab7',
        dark: '#482880',
        light: '#8561c5',
      },
      secondary: {
        main: '#2196f3',
        dark: '#1769aa',
        light: '#4dabf5',
      },
    },
  });
  
export const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#212946',
        dark: '#212946',
        light: '#212946',
      },
      secondary: {
        main: '#673ab7',
        dark: '#1769aa',
        light: '#4dabf5',
      },
      background: {
        paper: "#212946",
        default: "#212946"
      }
    },
  });
  