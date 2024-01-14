import React, { useState } from 'react';
import axios from 'axios';
import { defer } from 'react-router-dom';

import VirusTotalSummary from './components/virustotal-summary';

import { Container, Paper, Typography, Box } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2';

export const detectLoader = async ({params}) => {
    return defer({
        virusTotalMetadata: axios.get(`${process.env.REACT_APP_API_URL}/file/${params.hash}/virustotal`)
    })
}

const Detect = () => {
    return (
        <Container sx={{ paddingTop: 4 }}>
            <Grid container spacing={3}>
                <Grid xs={12} md={8}>
                    <Paper elevation={3}>
                        <Typography variant="h2">
                            Detections
                        </Typography>
                    </Paper>
                </Grid>
                <Grid xs={12} md={4}>
                    <Paper elevation={3} sx={{ px: 3, py: 3 }}>
                        <VirusTotalSummary />
                    </Paper>
                </Grid>
            </Grid>
        </Container >
    )
}

export default Detect;