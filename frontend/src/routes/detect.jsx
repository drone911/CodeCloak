import React from 'react';
import axios from 'axios';
import { defer, useOutletContext } from 'react-router-dom';

import VirusTotalSummary from './components/virustotal-summary';
import ShowDetections from './components/show-detections';

import { Container, Paper, Divider, ThemeProvider, createTheme } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2';



export const detectLoader = async ({ params }) => {
    return defer({
        virusTotalMetadata: axios.get(`${process.env.REACT_APP_API_URL}/file/${params.hash}/virustotal`),
        scanMetadata: axios.get(`${process.env.REACT_APP_API_URL}/file/${params.hash}/scan`)
    })
}

const scanAPIResponse =
    [{
        "detections": [{ "startIndex": 0, "endIndex": 15, "maliciousContent": "venenatis urna cursus eget nunc scelerisque viver venenatis urna cursumauris in aliquam sem fringilla ut morbi tincidunt", "maliciousContentContinue": "venenatis urna cursus eget nunc scelerisque viver venenatis urna cursumauris in aliquam sem fringilla ut morbi tincidunt", "paddedContentAfter": "urna cursumauris in aliquam", "paddedContentBefore": "urna cursumauris in aliquam" }, { "startIndex": 40, "endIndex": 55, "maliciousContent": "venenatis urna cursus eget nunc scelerisque viver venenatis urna cursumauris in aliquam sem fringilla ut morbi tincidunt", "paddedContentBefore": "cursumauris in aliquam sem fringilla", "paddedContentAfter": "cursumauris in aliquam sem fringilla" }, { "startIndex": 70, "endIndex": 95, "maliciousContent": "venenatis urna cursus eget nunc scelerisque viver in massa tempor nec feugimauris in aliquam sem fringilla ut morbi tincidunt", "paddedContentAfter": "feugimauris in aliquam sem", "paddedContentBefore": "feugimauris in aliquam sem" }],
        "hash": "44c13a651529cdc1c5236ed3fef2568698f1badf6bb8e70ba9bdac3fbe1b3d62", "scanner": "ClamAV", "scannerLogo": "https://www.clamav.net/assets/clamav-trademark.png", "scannerHome": "https://www.clamav.net/", "size": 305978
    }];
const noDetectionScanAPIResponse =
    [{
        "fileHeader": "venenatis urna cursus eget nunc scelerisque viver venenatis urna cursumauris in aliquam sem fringilla ut morbi tincidunt",
        "hash": "44c13a651529cdc1c5236ed3fef2568698f1badf6bb8e70ba9bdac3fbe1b3d62", "scanner": "ClamAV", "scannerLogo": "https://www.clamav.net/assets/clamav-trademark.png", "scannerHome": "https://www.clamav.net/", "size": 305978
    }];




const Detect = () => {
    const [_, isSmallScreen] = useOutletContext();
    return (

                <Grid container spacing={3} paddingTop={4}>
                    <Grid xs={12} md={8}>
                        <ShowDetections scanAPIResponse={noDetectionScanAPIResponse} isSmallScreen={isSmallScreen}></ShowDetections>
                        {isSmallScreen && <Divider sx={{ my: 2, maxWidth: "90%", mx: "auto" }} />}
                    </Grid>

                    <Grid xs={12} md={4}>
                        <VirusTotalSummary />
                    </Grid>
                </Grid>
    )
}

export default Detect;