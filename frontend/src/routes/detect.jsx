import React from 'react';
import axios from 'axios';
import { defer, useOutletContext } from 'react-router-dom';

import VirusTotalSummary from './components/virustotal-summary';
import ShowDetections from './components/show-detections';

import { Container, Paper, Divider } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2';



export const detectLoader = async ({ params }) => {
    return defer({
        virusTotalMetadata: axios.get(`${process.env.REACT_APP_API_URL}/file/${params.hash}/virustotal`)
    })
}

const scanAPIResponse =
    [{
        "detections": [{ "startIndex": 0, "endIndex": 15, "content": "venenatis urna cursus eget nunc scelerisque viver venenatis urna cursumauris in aliquam sem fringilla ut morbi tincidunt", "offset": 15 }, { "startIndex": 40, "endIndex": 55, "content": "venenatis urna cursus eget nunc scelerisque viver venenatis urna cursumauris in aliquam sem fringilla ut morbi tincidunt", "offset": 15 }, { "startIndex": 70, "endIndex": 95, "content": "venenatis urna cursus eget nunc scelerisque viver in massa tempor nec feugimauris in aliquam sem fringilla ut morbi tincidunt", "offset": 15 }],
        "hash": "44c13a651529cdc1c5236ed3fef2568698f1badf6bb8e70ba9bdac3fbe1b3d62", "scanner": "ClamAV", "scannerLogo": "https://www.clamav.net/assets/clamav-trademark.png", "scannerHome": "https://www.clamav.net/", "size": 305978
    }];




const Detect = () => {
    const [_, isSmallScreen] = useOutletContext();
    return (
        <Container sx={{ paddingTop: 4 }}>
            <Grid container spacing={3}>
                <Grid xs={12} md={8}>
                    {isSmallScreen &&
                        <VirusTotalSummary />

                    }
                    {!isSmallScreen &&
                        <Paper elevation={3} mx={{ sm: 4 }} sx={{ mx: 0 }}>
                            <ShowDetections scanAPIResponse={scanAPIResponse} isSmallScreen={isSmallScreen}></ShowDetections>
                        </Paper>
                    }

                    {isSmallScreen && <Divider sx={{ my: 2, maxWidth: "90%", mx: "auto" }} />}
                </Grid>

                <Grid xs={12} md={4}>
                    {isSmallScreen &&
                        <ShowDetections scanAPIResponse={scanAPIResponse} isSmallScreen={isSmallScreen}></ShowDetections>
                    }
                    {!isSmallScreen &&
                        <Paper elevation={3} sx={{ px: 3, py: 3 }}>
                            <VirusTotalSummary />
                        </Paper>
                    }
                </Grid>
            </Grid>
        </Container >
    )
}

export default Detect;