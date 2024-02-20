import React from "react";

import { Link, useNavigate } from "react-router-dom";

import { AppBar, styled, alpha, InputBase, ThemeProvider, Toolbar, Typography, IconButton, Drawer, Box, Stack } from "@mui/material";
import Brightness4Icon from '@mui/icons-material/Brightness4';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import SearchIcon from '@mui/icons-material/Search';

import logo from '../../logo.svg'
import { GitHub, LinkedIn, Menu } from "@mui/icons-material";

const Search = styled('div')(({ theme, isTabScreen }) => ({
    position: 'relative',
    display: "flex",
    justifyContent: "flex-start",
    borderRadius: "40px",
    paddingBlock: isTabScreen ? "0.3rem" : "",
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: isTabScreen ? "0.5rem" : 0,
    marginRight: isTabScreen ? "0.5rem" : 0,
    '& .MuiInputBase-root': {
        transition: "width 1s ease",
    },
    width: isTabScreen ? "95%" : '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
    },
    '&:focus-within': {
        width: isTabScreen ? "95%" : "40vw"
    }
}));

const SearchIconButton = styled(IconButton)(({ theme }) => ({
    zIndex: 2,
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    backgroundColor: alpha(theme.palette.common.black, 0.2),
    "&:hover": {
        backgroundColor: alpha(theme.palette.common.black, 0.2),
    },
    borderRadius: 0,
    borderTopRightRadius: "40px",
    borderBottomRightRadius: "40px",
    right: 0,
    top: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
}));

const StyledInputBase = styled(InputBase)(({ theme, isTabScreen }) => ({
    overflow: "auto",
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: "1rem",
        width: '100%',
    },
    '&:focus-within': {
        width: isTabScreen ? "100%" : "40vw"
    },
    paddingRight: "5rem",
    textOverflow: "ellipsis",
}));

const Header = ({ setDarkMode, darkMode, isSmallScreen, isTabScreen, darkModeTheme }) => {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const navigate = useNavigate()
    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setIsMenuOpen(open);
    };
    const handleThemeChange = () => {
        setDarkMode(!darkMode);
    };
    const handleSearchSubmit = (event) => {
        event.preventDefault();
        const searchInput = document.getElementById("searchInput");
        const text = searchInput.value;
        if (!text || text === "") {
            return;
        }
        searchInput.value = "";
        navigate(`/detect/${text}`);
    }
    return (
        <ThemeProvider theme={darkModeTheme}>
            <AppBar position="static" elevation={3} sx={{ backgroundColor: "" }}>
                <Toolbar sx={{ display: "flex", flexGrow: 1, justifyContent: isTabScreen ? "" : "space-between" }}>

                    <Box display="flex" flexDirection="row" alignItems="center" flexGrow={isTabScreen ? "1" : "0"}>
                        <Link to="/" rel="noopener noreferrer">
                            <div
                                style={{
                                    width: '48px',
                                    height: '48px',
                                    backgroundColor: '',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginRight: '8px',
                                    paddingLeft: '4px',
                                    marginTop: "0.5rem",
                                    marginBottom: "0.5rem",

                                }}
                            >
                                <img src={logo} alt="Logo" style={{ height: '48px' }} />
                            </div>
                        </Link>
                        <Typography variant="h6" component="div">
                            <Link to="/" rel="noopener noreferrer" style={{ marginLeft: "0.5rem", textDecoration: 'none', color: 'inherit', textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                Code Cloak
                            </Link>
                        </Typography>
                    </Box>
                    {isTabScreen &&
                        <React.Fragment>
                            <IconButton sx={{ marginRight: "0.3rem" }} onClick={toggleDrawer(true)}>
                                <Menu></Menu>
                            </IconButton>
                            <Drawer
                                anchor="right"
                                open={isMenuOpen}
                                onClose={toggleDrawer(false)}
                            >
                                <Stack spacing={2} sx={{ marginTop: "1.5rem", paddingX: "0.5rem" }}>
                                    <Box>
                                        <form onSubmit={handleSearchSubmit}>
                                            <Search isTabScreen={isTabScreen}>
                                                <StyledInputBase
                                                    placeholder="Sha256 hash"
                                                    inputProps={{ 'aria-label': 'search', 'id': "searchInput" }}
                                                    isTabScreen={isTabScreen}
                                                />
                                                <SearchIconButton type="submit">
                                                    <SearchIcon />
                                                </SearchIconButton>

                                            </Search>
                                        </form>
                                    </Box>
                                    <Box display="flex" flexDirection="row" alignItems="center" alignContent="space-evenly" justifyContent="center">
                                        <Typography variant="h6" component="div" sx={{ marginX: "0.3rem", fontFamily: "Lobster Two, sans-serif" }}>
                                            By Jigar Patel
                                        </Typography>
                                        <Link to="https://www.github.com/drone911" rel="noopener noreferrer" target="_blank" style={{ display: "flex", alignItems: "center", textDecoration: 'none', color: 'inherit', margin: "auto 0.3rem" }}>
                                            <GitHub color="white" ></GitHub>
                                        </Link>
                                        <Link to="https://www.linkedin.com/in/ji-patel" rel="noopener noreferrer" target="_blank" style={{ display: "flex", alignItems: "center", textDecoration: 'none', color: 'inherit', margin: "auto 0.3rem" }}>
                                            <LinkedIn color="white" ></LinkedIn>
                                        </Link>
                                    </Box>

                                </Stack>

                            </Drawer>
                        </React.Fragment>
                    }
                    {!isTabScreen &&
                        <React.Fragment>
                            <form onSubmit={handleSearchSubmit}>
                                <Search isTabScreen={isTabScreen}>
                                    <StyledInputBase
                                        placeholder="Sha256 hash"
                                        inputProps={{ 'aria-label': 'search', 'id': "searchInput" }}
                                        isTabScreen={isTabScreen}
                                    />
                                    <SearchIconButton type="submit">
                                        <SearchIcon />
                                    </SearchIconButton>

                                </Search>
                            </form>
                            <Box display="flex" flexDirection="row" alignItems="center" alignContent="space-evenly" justifyContent="center">
                                <Typography variant="h6" component="div" sx={{ marginX: "0.3rem", fontFamily: "Lobster Two, sans-serif" }}>
                                    By Jigar Patel
                                </Typography>
                                <Link to="https://www.github.com/drone911" rel="noopener noreferrer" target="_blank" style={{ display: "flex", alignItems: "center", textDecoration: 'none', color: 'inherit', margin: "auto 0.3rem" }}>
                                    <GitHub color="white" ></GitHub>
                                </Link>
                                <Link to="https://www.linkedin.com/in/ji-patel" rel="noopener noreferrer" target="_blank" style={{ display: "flex", alignItems: "center", textDecoration: 'none', color: 'inherit', margin: "auto 0.3rem" }}>
                                    <LinkedIn color="white" ></LinkedIn>
                                </Link>
                            </Box>
                        </React.Fragment>
                    }
                    {/* {darkMode ? <Brightness4Icon /> : <WbSunnyIcon />}
        <Switch
          color='secondary'
          checked={darkMode}
          onChange={handleThemeChange}
          inputProps={{ 'aria-label': 'toggle dark mode' }}
        /> */}

                </Toolbar>

            </AppBar >
        </ThemeProvider >
    )
}

export default Header;