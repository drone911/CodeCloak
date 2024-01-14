import React from 'react';
import { Await, useLoaderData } from 'react-router-dom';

import { Container, Paper, Typography, Box } from '@mui/material';


const VirusTotalSummary = () => {
    const { virusTotalMetadata } = useLoaderData();

    return (
        <React.Fragment>
            <Box display="flex" alignItems="center" justifyContent="center">
                <svg viewBox="0 0 100 100" style={{ display: "inline", fill: "#0b4dda", width: "2rem", height: "2rem", marginRight: "0.5rem" }}>
                    <path d="M45.292 44.5 0 89h100V0H0l45.292 44.5zM90 80H22l35.987-35.2L22 9h68v71z"></path>
                </svg>
                <Typography variant="h6" sx={{ display: "inline", color: "#0b4dda" }}>
                    VIRUSTOTAL SUMMARY
                </Typography>
            </Box>
            <Box>
                <React.Suspense fallback={<div>TODO: Fallback</div>}>
                    <Await
                        resolve={virusTotalMetadata}
                        errorElement={
                            <div>Error Element: TODO</div>
                        }
                        children={(metadata) => (
                            <Box>
                                TODO: {JSON.stringify(metadata.data)}
                            </Box>
                        )}
                    />
                </React.Suspense>

            </Box>
        </React.Fragment>
    )
}

export default VirusTotalSummary;