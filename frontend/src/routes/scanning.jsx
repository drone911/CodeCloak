import React from 'react';
import axios from 'axios';

import { Container, Typography, Snackbar, Alert, CircularProgress } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

const minWaitTime = 5000;
const onErrorWaitTime = 6000;
const displayTime = 8000;

const displayText = [
    "Scanning your file...",
    "Splitting recursively and scanning...",
    "Grinding the gears...",
    "Still working on it...",
    "Well, this is awkward...",
    "Give us a minute please..."
]

const Scanning = () => {
    const navigate = useNavigate();
    const params = useParams();
    const [intervalId, setIntervalId] = React.useState(null);

    const [displayTextIndex, setDisplayTextIndex] = React.useState(0);

    React.useEffect(() => {
        const newIntervalId = setInterval(() => {
            const newDisplayIndex = (displayTextIndex + 1) % displayText.length;
            setDisplayTextIndex(newDisplayIndex);
        }, displayTime);

        setIntervalId(newIntervalId);

        return () => {
            clearInterval(newIntervalId);
        };
    }, [displayTextIndex]);

    const [showFileScanErrorSnackbar, setshowFileScanErrorSnackbar] = React.useState(false);

    React.useEffect(() => {
        const scanFile = async () => {
            try {
                await Promise.all([
                    axios.post(`${process.env.REACT_APP_API_URL}/file/${params.hash}/scan`, {}),
                    new Promise(resolve => setTimeout(resolve, minWaitTime))
                ]);
                navigate(`/detect/${params.hash}`);
            } catch (error) {
                console.error('Error scanning file:', error);
                setTimeout(() => {
                    setshowFileScanErrorSnackbar(true);
                }, 200);
                setTimeout(() => {
                    setshowFileScanErrorSnackbar(false);
                    navigate("/");
                }, onErrorWaitTime);
            }
        };
        scanFile();
    }, [params.hash, navigate]);


    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setshowFileScanErrorSnackbar(false);
    }
    return (
        <Container sx={{ display: "flex", flexDirection: "column", alignItems: "center", alignContent: "space-around", justifyContent: "center", paddingTop: 6, flexGrow: 1 }}>
            <Typography variant='h6' color="primary" sx={{ transition: "opacity 1s ease-in-out", paddingBottom: 5 }}>
                {displayText[displayTextIndex]}
            </Typography>
            <CircularProgress size={100} color="secondary" />
            <Snackbar open={showFileScanErrorSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: '100%' }}>
                    Error scanning file, please try again
                </Alert>
            </Snackbar>
        </Container>
    )
}

export default Scanning; 