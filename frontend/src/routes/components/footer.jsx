import { AppBar, ThemeProvider } from "@mui/material";
import React from "react";

const Footer = ({ darkModeTheme }) => {
    return (
        <ThemeProvider theme={darkModeTheme}>
            {/* <AppBar position="sticky" sx={{bottom: 0, top: "auto"}}>
                Wow
            </AppBar> */}
        </ThemeProvider>

    )
}

export default Footer;