import React from "react";

import { Link, useNavigate, useOutletContext } from "react-router-dom";

import { AppBar, styled, alpha, InputBase, ThemeProvider, Toolbar, Typography, IconButton, Button, Drawer, Box, Avatar } from "@mui/material";
import Brightness4Icon from '@mui/icons-material/Brightness4';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import SearchIcon from '@mui/icons-material/Search';

import logo from '../../logo.svg'
import { GitHub, LinkedIn, Menu } from "@mui/icons-material";

const Search = styled('div')(({ theme, isTabScreen }) => ({
    position: 'relative',
    display: "flex",
    justifyContent: "flex-start",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
    },
    transition: "width 2s",
    '&:focus-within': {
        width: isTabScreen ? "100%" : "40vw"
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
    borderTopRightRadius: theme.shape.borderRadius,
    borderBottomRightRadius: theme.shape.borderRadius,
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
    const [searchValue, setSearchValue] = React.useState("")
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
    const handleSearchClick = () => {
        const searchInput = document.getElementById("searchInput");
        const text = searchInput.value;
        searchInput.value = "";
        navigate(`/detect/${text}`);
    }
    return (
        <ThemeProvider theme={darkModeTheme}>
            <AppBar position="static" elevation={3}>
                <Toolbar sx={{ display: "flex", flexGrow: 1, justifyContent: "space-between" }}>
                    {isTabScreen &&
                        <React.Fragment>
                            <IconButton sx={{ marginRight: "0.3rem" }} onClick={toggleDrawer(true)}>
                                <Menu></Menu>
                            </IconButton>
                            <Drawer
                                anchor="left"
                                open={isMenuOpen}
                                onClose={toggleDrawer(false)}
                            >
                                <Search isTabScreen={isTabScreen}>
                                    <SearchIconButton>
                                        <SearchIcon />
                                    </SearchIconButton>
                                    <StyledInputBase
                                        placeholder="Sha256 hash"
                                        inputProps={{ 'aria-label': 'search' }}
                                        isTabScreen={isTabScreen}
                                    />
                                </Search>

                            </Drawer>
                        </React.Fragment>
                    }
                    <Box display="flex" flexDirection="row" alignItems="center" justifyContent={isTabScreen ? "center" : "flex-start"}>
                        <Link to="/" rel="noopener noreferrer">
                            <div
                                style={{
                                    width: '48px',
                                    height: '48px',
                                    backgroundColor: 'white',
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
                                <img src={logo} alt="Logo" style={{ height: '58px' }} />
                            </div>
                        </Link>
                        <Typography variant="h6" component="div">
                            <Link to="/" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                                Catch Me If You Scan
                            </Link>
                        </Typography>
                    </Box>
                    {!isTabScreen &&
                        <Search isTabScreen={isTabScreen}>
                            <StyledInputBase
                                placeholder="Sha256 hash"
                                inputProps={{ 'aria-label': 'search', 'id': "searchInput" }}
                                isTabScreen={isTabScreen}
                            />
                            <SearchIconButton onClick={handleSearchClick}>
                                <SearchIcon />
                            </SearchIconButton>

                        </Search>

                    }
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
                    {/* {darkMode ? <Brightness4Icon /> : <WbSunnyIcon />}
        <Switch
          color='secondary'
          checked={darkMode}
          onChange={handleThemeChange}
          inputProps={{ 'aria-label': 'toggle dark mode' }}
        /> */}

                </Toolbar>

            </AppBar>
        </ThemeProvider >
    )
}

export default Header;