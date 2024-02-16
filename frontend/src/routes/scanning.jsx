import React from 'react';
import axios from 'axios';

import { Container, Typography, Snackbar, Alert, CircularProgress } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

const minWaitTime = 5000;
const onErrorWaitTime = 6000;
const displayTime = 8000;

const displayText = [
    "Tickling servers to wake them up...",
    "Juggling ones and zeros with care...",
    "Sending cyber ninjas out to fight cyber dragons...",
    "Convincing pixels to align perfectly...",
    "Convincing electrons to speed up their commute..."
]

const Scanning = () => {
    const navigate = useNavigate();
    const params = useParams();

    const [displayTextIndex, setDisplayTextIndex] = React.useState(0);
    const scanApiCalled = React.useRef(false);
    React.useEffect(() => {
        const newIntervalId = setInterval(() => {
            const newDisplayIndex = (displayTextIndex + 1) % displayText.length;
            setDisplayTextIndex(newDisplayIndex);
        }, displayTime);

        return () => {
            clearInterval(newIntervalId);
        };
    }, [displayTextIndex]);

    const [showFileScanErrorSnackbar, setshowFileScanErrorSnackbar] = React.useState(false);

    React.useEffect(() => {
        const scanFile = async () => {
            if (!scanApiCalled.current) {
                try {
                    await (Promise.all([
                        axios.post(`${process.env.REACT_APP_API_URL}/file/${params.hash}/scan`, {}),
                        new Promise(resolve => setTimeout(resolve, minWaitTime))
                    ]));
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
                } finally {
                    scanApiCalled.current = true;
                }
            }
        };
        scanFile();
    }, []);


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