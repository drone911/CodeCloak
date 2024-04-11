import React, { useState } from 'react';
import { Outlet } from 'react-router-dom'

import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import { lightTheme, darkTheme } from '../theme';

import Header from './components/header';
import Footer from './components/footer';



const App = () => {

  // const [darkMode, setDarkMode] = useState(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const [darkMode, setDarkMode] = useState(false);
  let lightThemePadded = createTheme(lightTheme)
  let darkThemePadded = createTheme(darkTheme);
  const theme = darkMode ? darkThemePadded : lightThemePadded;
  const isSmallScreen = useMediaQuery(lightThemePadded.breakpoints.down('sm'));
  const isTabScreen = useMediaQuery(lightThemePadded.breakpoints.down('md'));

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline>
        <Header setDarkMode={setDarkMode} darkMode={darkMode} isSmallScreen={isSmallScreen} isTabScreen={isTabScreen} darkModeTheme={darkThemePadded}></Header>
        <Outlet context={[darkMode, isSmallScreen, isTabScreen, darkThemePadded]} />
        <Footer darkModeTheme={darkThemePadded}></Footer>
      </CssBaseline>

    </ThemeProvider >

  );
};

export default App;
