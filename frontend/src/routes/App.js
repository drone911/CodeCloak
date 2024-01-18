import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom'

import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import { lightTheme, darkTheme } from '../theme';

import logo from '../logo.svg'

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Switch from '@mui/material/Switch';

import Brightness4Icon from '@mui/icons-material/Brightness4';
import WbSunnyIcon from '@mui/icons-material/WbSunny';


const App = () => {

  // const [darkMode, setDarkMode] = useState(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const [darkMode, setDarkMode] = useState(true);

  const isSmallScreen = useMediaQuery(lightTheme.breakpoints.down('sm'));

  const handleThemeChange = () => {
    setDarkMode(!darkMode);
  };
  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline>
        <AppBar position="static" color="transparent" elevation={3}>

          <Toolbar>
            <Link to="/" rel="noopener noreferrer">
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
            </Link>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              <Link to="/" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                CatchMeIfYouScan
              </Link>
            </Typography>
            {darkMode ? <Brightness4Icon /> : <WbSunnyIcon />}
            <Switch
              color='secondary'
              checked={darkMode}
              onChange={handleThemeChange}
              inputProps={{ 'aria-label': 'toggle dark mode' }}
            />
          </Toolbar>

        </AppBar>
        <Outlet context={[darkMode]} />
      </CssBaseline>
    </ThemeProvider>
  );
};

export default App;
