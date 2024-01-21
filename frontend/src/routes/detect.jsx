import React, { useState } from 'react';
import axios from 'axios';
import { defer, useOutletContext } from 'react-router-dom';

import VirusTotalSummary from './components/virustotal-summary';

import { Container, Paper, Typography, Stack, Tooltip, Box, Divider } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2';

export const detectLoader = async ({ params }) => {
    return defer({
        virusTotalMetadata: axios.get(`${process.env.REACT_APP_API_URL}/file/${params.hash}/virustotal`)
    })
}

const scanAPIResponse =
    [{
        "detections": [{ "startIndex": 0, "endIndex": 15, "content": "venenatis urna cursus eget nunc scelerisque viver venenatis urna cursumauris in aliquam sem fringilla ut morbi tincidunt", "offset": 15 }, { "startIndex": 40, "endIndex": 55, "content": "venenatis urna cursus eget nunc scelerisque viver venenatis urna cursumauris in aliquam sem fringilla ut morbi tincidunt", "offset": 15 }, { "startIndex": 70, "endIndex": 95, "content": "venenatis urna cursus eget nunc scelerisque viver in massa tempor nec feugimauris in aliquam sem fringilla ut morbi tincidunt", "offset": 15 }],
        "hash": "44c13a651529cdc1c5236ed3fef2568698f1badf6bb8e70ba9bdac3fbe1b3d62", "Scanner": "ClamAV", "ScannerLogo": "https://www.clamav.net/assets/clamav-trademark.png"
    }];

const DetectionsPaper = ({ detections, isSmallScreen }) => {
    return (
        <React.Fragment>

            <Typography variant="h4" px={3} paddingY={isSmallScreen ? 1.5 : 3} textAlign={isSmallScreen ? "center" : "start"} >
                Detections
            </Typography>
            <Paper elevation={3} sx={{ mx: 3 }}>

                <Grid container sx={{ border: "1px solid var(--ds-border,#ebecf0)" }}>
                    <Grid container xs={12}>
                        <Grid xs={1} sx={{ border: "1px solid var(--ds-border,#ebecf0)", backgroundColor: "var(--ds-lightest-grey)" }}>
                            Up Arrow
                        </Grid>
                        <Grid xs={11} sx={{ border: "1px solid var(--ds-border,#ebecf0)", backgroundColor: "var(--ds-lightest-grey)" }}>
                            To:Do
                        </Grid>

                    </Grid>
                    <Grid container xs={12} sx={{ overflow: "auto" }}>
                        {detections.map((detection, index) => (
                            <React.Fragment key={index}>

                                <Grid xs={1} sx={{ paddingTop: 1, borderInline: "1px solid var(--ds-border,#ebecf0)" }}>
                                    Indexes
                                </Grid>
                                <Grid xs={11} sx={{ paddingTop: 1, borderLeft: "1px solid var(--ds-border,#ebecf0)" }}>
                                    <Stack spacing={2}>
                                        <Tooltip
                                            title={`Start Index: ${detection.startIndex}, End Index: ${detection.endIndex}`}
                                            arrow
                                        >
                                            <Box
                                                style={{
                                                    padding: `0 ${detection.offset}px`,
                                                    backgroundColor: 'white',
                                                }}
                                            >
                                                <span style={{ backgroundColor: "var(--ds-background-green-subtle)" }}>
                                                    {detection.content.substring(
                                                        0,
                                                        detection.offset - 1
                                                    )}
                                                </span>
                                                <span style={{
                                                    backgroundColor: 'var(--ds-background-red-light)', '&:hover': {
                                                        "scale": "1.1",

                                                    }
                                                }}>
                                                    {detection.content.substring(
                                                        detection.offset,
                                                        detection.content.length - detection.offset
                                                    )}
                                                </span>
                                                <span style={{ backgroundColor: 'var(--ds-background-green-subtle)' }}>
                                                    {detection.content.substring(
                                                        detection.content.length - detection.offset + 1
                                                    )}
                                                </span>
                                            </Box>
                                        </Tooltip>
                                        {index < detections.length - 1}
                                    </Stack>
                                </Grid>
                            </React.Fragment>
                        ))}
                    </Grid>
                    <Grid container xs={12}>
                        <Grid xs={1} sx={{ border: "1px solid var(--ds-border,#ebecf0)", backgroundColor: "var(--ds-lightest-grey)" }}>
                            Down Arrow
                        </Grid>
                        <Grid xs={11} sx={{ border: "1px solid var(--ds-border,#ebecf0)", backgroundColor: "var(--ds-lightest-grey)" }}>
                            To:Do
                        </Grid>

                    </Grid>

                </Grid>
            </Paper>
        </React.Fragment>
    )
}

const Detect = () => {
    const [_, isSmallScreen] = useOutletContext();
    const detections = scanAPIResponse[0].detections;
    return (
        <Container sx={{ paddingTop: 4 }}>
            <Grid container spacing={3}>
                <Grid xs={12} md={8}>
                    {isSmallScreen &&
                        <VirusTotalSummary />

                    }
                    {!isSmallScreen &&
                        <Paper elevation={3} mx={{ sm: 4 }} sx={{ mx: 0 }}>
                            <DetectionsPaper detections={detections} isSmallScreen={isSmallScreen}></DetectionsPaper>
                        </Paper>
                    }

                    {isSmallScreen && <Divider sx={{ my: 2, maxWidth: "90%", mx: "auto" }} />}
                </Grid>

                <Grid xs={12} md={4}>
                    {isSmallScreen &&
                        <DetectionsPaper detections={detections} isSmallScreen={isSmallScreen}></DetectionsPaper>
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