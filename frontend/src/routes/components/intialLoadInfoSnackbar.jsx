import React from "react";
import Button from '@mui/material/Button';
import SnackbarContent from '@mui/material/SnackbarContent';
import { Snackbar } from "@mui/material";
import { getCookie, setCookie } from "./utility";
import { useTheme } from "@emotion/react";

const IntialLoadInfoSnackbar = ({ isTabScreen }) => {
    const [showLoadInfo, setShowLoadInfo] = React.useState(false);
    const theme = useTheme();

    const action = (
        <Button color="secondary" size="small" onClick={() => {
            setShowLoadInfo(false)
        }}>
            Okay!
        </Button>
    )

    React.useEffect(() => {
        const loadInfoShown = getCookie("loadInfoShown");
        if (!loadInfoShown) {
            setShowLoadInfo(true);
            setCookie("loadInfoShown", true, 1);
        }
    });

    return (
        <Snackbar open={showLoadInfo} anchorOrigin={{ vertical: isTabScreen ? "center" : "bottom", horizontal: "center" }}>
            <SnackbarContent sx={{ backgroundColor: theme.palette.grey[800] }} message={isTabScreen ? "Please wait for backend to spin up" : "The backend is on a free host. Please give it about 10 seconds to start. Appreciate your patience!"} action={action} />
        </Snackbar>
    );
}

export default IntialLoadInfoSnackbar;