import React, { useState } from 'react';
import { Route, Routes, Router, RedirectFunction, BrowserRouter, useHistory, redirect } from 'react-router-dom'
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import Landing from './components/landing';
import Detect from './components/detect';

import logo from './logo.svg'

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Switch from '@mui/material/Switch';
import Container from '@mui/material/Container';

import Brightness4Icon from '@mui/icons-material/Brightness4';
import WbSunnyIcon from '@mui/icons-material/WbSunny';

const lightTheme = createTheme({
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

const darkTheme = createTheme({
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

const App = () => {

  // const [darkMode, setDarkMode] = useState(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const [darkMode, setDarkMode] = useState(false);

  const isSmallScreen = useMediaQuery(lightTheme.breakpoints.down('sm'));

  const handleThemeChange = () => {
    setDarkMode(!darkMode);
  };
  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline>
        <AppBar position="static" color="transparent" elevation={3}>
          <Container>
            <Toolbar>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: darkMode ? 'white' : '',
                  borderRadius: '50%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: '8px',
                  paddingLeft: '4px'
                }}
              >
                <img src={logo} alt="Logo" style={{ height: '58px' }} />
              </div>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                CatchMeIfYouScan
              </Typography>
              {darkMode ? <Brightness4Icon /> : <WbSunnyIcon />}
              <Switch
                color='secondary'
                checked={darkMode}
                onChange={handleThemeChange}
                inputProps={{ 'aria-label': 'toggle dark mode' }}
              />
            </Toolbar>
          </Container>
        </AppBar>
        <BrowserRouter>
          <Routes>
            <Route
              path=""
              element={<Landing isSmallScreen={isSmallScreen}/>}
            />
            <Route path="/detect/:fileHash" element={<Detect />}></Route>
          </Routes>
        </BrowserRouter>
      </CssBaseline>
    </ThemeProvider>
  );
};

export default App;
