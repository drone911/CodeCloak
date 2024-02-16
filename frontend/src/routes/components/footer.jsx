import { AppBar, ThemeProvider } from "@mui/material";
import React from "react";

const Footer = ({ darkModeTheme }) => {
        return (
        <ThemeProvider theme={darkModeTheme}>
            {/* <footer style={{
                position: "absolute",
                backgroundColor: darkModeTheme.palette.background.default,
                backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.08))",
                boxShadow: darkModeTheme.shadows[2],
                transform: "translateY(-2rem)",
                minHeight: "2rem"
            }}>

            </footer> */}
                        </ThemeProvider>

    )
}

export default Footer;