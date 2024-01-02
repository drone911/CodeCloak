import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
    palette: {
        primary: {
            main: '#ffffff',
            dark: '#ffffff',
            light: '#ffffff',
        },
        secondary: {
            main: '#673ab7',
            dark: '#482880',
            light: '#8561c5',
        },
        accent: {
            main: '#2196f3',
            dark: '#1769aa',
            light: '#4dabf5',
        },
        alternate: {
            main: '#e0e0e0',
            dark: '#bdbdbd',
            light: '#eeeeee',
        },
        divider: "#eef2f6",
        error: {
            main: 'red',
        },
    }
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
        accent: {
            main: '#2196f3',
            dark: '#1769aa',
            light: '#4dabf5',
        },
        alternate: {
            main: '#424242',
            dark: '#303030',
            light: '#555555',
        },
        background: {
            default: "#212946",
            paper: "#212946",
        },
        divider: "#111936",
        error: {
            main: 'red',
        },
    }
});
