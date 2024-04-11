import { AppBar, ThemeProvider, Typography } from "@mui/material";
import React from "react";

const Footer = ({ darkModeTheme }) => {
        return (
        <ThemeProvider theme={darkModeTheme}>
            <footer style={{
                marginBlockStart: "2.7rem",
                backgroundColor: darkModeTheme.palette.background.default,
                backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.08))",
                boxShadow: darkModeTheme.shadows[2],
                minHeight: "5rem",
                boxShadow: "0px -3px 3px -2px rgba(0,0,0,0.2),0px -3px 4px 0px rgba(0,0,0,0.14),0px -1px 8px 0px rgba(0,0,0,0.12)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}>
                <Typography variant="p" align="center" paddingInline={4} color={darkModeTheme.palette.grey[100]}>
                    ** This site is not intended for any harmful or illegal usage. **
                </Typography>
            </footer>
                        </ThemeProvider>

    )
}

export default Footer;