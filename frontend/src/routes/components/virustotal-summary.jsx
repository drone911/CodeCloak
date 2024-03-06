import React from 'react';
import { Await, useLoaderData } from 'react-router-dom';

import { Container, Paper, Typography, Box, Stack, Button, Link, Stepper, Step, StepLabel, StepContent, Chip, List, Skeleton } from '@mui/material';
import { OpenInNew, Loop } from '@mui/icons-material'
import styled from '@emotion/styled';

const ChipWithMargin = styled(Chip)(() => ({
    marginRight: "0.2rem",
    marginBottom: "0.4rem"
}));

const reputationMap = {
    "[50, 100]": {
        "reputationText": "Benign & Trusted",
        "reputationColor": "green",
        "reputationBackgroundColor": "lightgreen"
    },
    "0": {
        "reputationText": "Neutral",
        "reputationColor": "green",
        "reputationBackgroundColor": "lightgreen",
    },
    "(0, 50)": {
        "reputationText": "Benign",
        "reputationColor": "green",
        "reputationBackgroundColor": "lightgreen",
    },
    "(-50,0)": {
        "reputationText": "Malicious",
        "reputationColor": "red",
        "reputationBackgroundColor": "#FFD6D6",
        // Light Red
    },
    "[-100, -50]": {
        "reputationText": "Highly Malicious",
        "reputationColor": "red",
        "reputationBackgroundColor": "#FFD6D6"
        // Light Red
    }
};


const steps = [
    {
        label: 'Upload on Virustotal',
        description: ``,
    },
    {
        label: 'Refresh Page',
        description:
            '',
    },
];

const calculateRelativeDate = (date) => {
    const now = new Date();
    const diffInMilliseconds = now - new Date(date);
    const diffInSeconds = Math.floor(diffInMilliseconds / 1000);

    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

    if (diffInSeconds < 60) {
        return rtf.format(-diffInSeconds, 'second');
    } else if (diffInSeconds < 3600) {
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        return rtf.format(-diffInMinutes, 'minute');
    } else if (diffInSeconds < 86400) {
        const diffInHours = Math.floor(diffInSeconds / 3600);
        return rtf.format(-diffInHours, 'hour');
    } else {
        const diffInDays = Math.floor(diffInSeconds / 86400);
        return rtf.format(-diffInDays, 'day');
    }
};

const VirusTotalPaperErrorElement = () => {
    const virusTotalUploadLink = "https://www.virustotal.com/gui/home/upload"
    const [activeStep, setActiveStep] = React.useState(0);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    return (
        <Box sx={{ maxWidth: 400 }} my={4} mx={3} spacing={3} >
            <Typography variant='h5' mb={2} color="error" >
                File not found in VirusTotal's Database
            </Typography>

            <Stepper activeStep={activeStep} orientation="vertical">
                {steps.map((step, index) => (
                    <Step key={step.label}>
                        <StepLabel
                            optional={
                                index === 2 ? (
                                    <Typography variant="caption">Last step</Typography>
                                ) : null
                            }
                        >
                            {step.label}
                        </StepLabel>
                        <StepContent>
                            <Typography mb={2}>{step.description}</Typography>
                            {activeStep == 0 && (
                                <Link href={virusTotalUploadLink} underline='none' rel="noopener, noreferrer" target="_blank">
                                    <Button variant="contained" size="medium" endIcon={<OpenInNew />}>
                                        Virustotal
                                    </Button>
                                </Link>

                            )}
                            {activeStep == 1 && (
                                <Button variant="contained" onClick={() => { window.location.reload() }} size="medium" color="success" endIcon={<Loop />}>
                                    Reload
                                </Button>

                            )}
                            <Box sx={{ mb: 2, mt: 1 }}>
                                <div>
                                    {
                                        index === 0 &&
                                        (<Button
                                            variant="outlined"
                                            onClick={handleNext}
                                            sx={{ mt: 1, mr: 1 }}
                                        >
                                            Continue
                                        </Button>
                                        )
                                    }
                                    {
                                        index === 1 &&
                                        <Button
                                            disabled={index === 0}
                                            variant="outlined"
                                            onClick={handleBack}
                                            sx={{ mt: 1, mr: 1 }}
                                        >
                                            Back
                                        </Button>
                                    }
                                </div>
                            </Box>
                        </StepContent>
                    </Step>
                ))}
            </Stepper>
        </Box>
    );
}

const VirusTotalSkeleon = () => {
    return (
        <Box sx={{ maxWidth: 400 }} my={4} mx={3}>
            <Stack spacing={1}>
                <Box display="flex" flexDirection="column">
                    <Typography variant="body2" color="var(--primary-text-dark-600)" sx={{ fontWeight: "600" }}>
                        Reputation
                    </Typography>
                    <Skeleton></Skeleton>
                </Box>
                <Box>
                    <Typography variant="body2" color="var(--primary-text-dark-600)" sx={{ fontWeight: "600" }}>
                        Names
                    </Typography>
                    <Skeleton></Skeleton>
                </Box>
                <Box>
                    <Typography variant="body2" color="var(--primary-text-dark-600)" sx={{ fontWeight: "600" }}>
                        Associated Tags
                    </Typography>
                    <Skeleton></Skeleton>
                </Box>
                <Box>
                    <Typography variant="body2" color="var(--primary-text-dark-600)" sx={{ fontWeight: "600" }}>
                        Detected File Types
                    </Typography>
                    <Skeleton></Skeleton>
                </Box>
                <Box>
                    <Typography variant="body2" color="var(--primary-text-dark-600)" sx={{ fontWeight: "600" }}>
                        Fetched
                    </Typography>
                    <Skeleton></Skeleton>
                </Box>
            </Stack >
        </Box >
    )
}
const VirusTotalPaper = ({ metadata, theme }) => {

    const MAX_CHIP_LABELS = 8;
    const reputation = Number(metadata.data.reputation);
    let reputationText, reputationColor, reputationBackgroundColor;

    if (reputation <= -50) {
        ({ reputationText, reputationColor, reputationBackgroundColor } = reputationMap["[-100, -50]"]);
    } else if (reputation < 0) {
        ({ reputationText, reputationColor, reputationBackgroundColor } = reputationMap["(-50,0)"]);
    } else if (reputation == 0) {
        ({ reputationText, reputationColor, reputationBackgroundColor } = reputationMap["0"]);
    } else if (reputation < 50) {
        ({ reputationText, reputationColor, reputationBackgroundColor } = reputationMap["(0, 50)"]);
    } else {
        ({ reputationText, reputationColor, reputationBackgroundColor } = reputationMap["[50, 100]"]);
    }


    return (
        <Box sx={{ maxWidth: 400 }} my={4} mx={3}>
            <Stack spacing={1}>

                <Box display="flex" flexDirection="column">
                    <Typography variant="body2" color="var(--primary-text-dark-600)" sx={{ fontWeight: "600" }}>
                        Reputation
                    </Typography>
                    <Button px={3} py={2} variant="contained" sx={{
                            '&:hover': {
                            backgroundColor: reputationBackgroundColor,
                            boxShadow: "0px 3px 1px -2px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12)",
                            cursor: "default",
                        }, color: reputationColor, backgroundColor: reputationBackgroundColor
                    }}>
                        <Typography variant='h6'>
                            {reputationText}
                        </Typography>
                    </Button>
                </Box>
                {
                    metadata.data.names && metadata.data.names.length > 0 && <Box>
                        <Typography variant="body2" color="var(--primary-text-dark-600)" sx={{ fontWeight: "600" }}>
                            Names
                        </Typography>
                        <List>
                            {metadata.data.names.slice(0, MAX_CHIP_LABELS).map((name, index) => {
                                return (
                                    <ChipWithMargin key={index} size="medium" color="primary" label={name} variant="outlined"></ChipWithMargin>
                                )
                            })}
                        </List>

                    </Box>
                }
                {
                    metadata.data.tags && metadata.data.tags.length > 0 &&
                    <Box>

                        <Typography variant="body2" color="var(--primary-text-dark-600)" sx={{ fontWeight: "600" }}>
                            Associated Tags
                        </Typography>
                        <List>
                            {metadata.data.tags.slice(0, MAX_CHIP_LABELS).map((name, index) => {
                                return (
                                    <ChipWithMargin key={index} size="medium" label={name} color="primary" variant="outlined"></ChipWithMargin>
                                )
                            })}
                        </List>

                    </Box>
                }
                {
                    metadata.data.typeTags && metadata.data.typeTags.length > 0 &&
                    <Box>

                        <Typography variant="body2" color="var(--primary-text-dark-600)" sx={{ fontWeight: "600" }}>
                            Detected File Types
                        </Typography>
                        <List>
                            {metadata.data.typeTags.slice(0, MAX_CHIP_LABELS).map((name, index) => {
                                return (
                                    <ChipWithMargin key={index} size="medium" label={name} color="primary" variant="outlined"></ChipWithMargin>
                                )
                            })}
                        </List>

                    </Box>
                }
                {
                    metadata.data.fetchTime &&
                    <Box>
                        <Typography variant="body2" color="var(--primary-text-dark-600)" sx={{ fontWeight: "600" }}>
                            Fetched
                        </Typography>
                        <List>
                            <Typography sx={{ color: "var(--primary-light)", textTransform: "capitalize" }}>
                                {calculateRelativeDate(metadata.data.fetchTime)}
                            </Typography>

                        </List>

                    </Box>
                }
            </Stack >
        </Box >
    );
}
const VirusTotalSummary = () => {
    const { virusTotalMetadata } = useLoaderData();
    return (
        <React.Fragment>
            <Box display="flex" alignItems="center" justifyContent="center" marginTop={1} >
                <svg viewBox="0 0 100 100" style={{ display: "inline", fill: "var(--virustotal-blue)", width: "2rem", height: "2rem", marginRight: "0.5rem" }}>
                    <path d="M45.292 44.5 0 89h100V0H0l45.292 44.5zM90 80H22l35.987-35.2L22 9h68v71z"></path>
                </svg>
                <Typography variant="h5" sx={{ display: "inline", color: "var(--virustotal-blue)", fontWeight: "700" }}>
                    Virustotal Summary
                </Typography>
            </Box>
            <Box>
                <React.Suspense fallback={<VirusTotalSkeleon />}>
                    <Await
                        resolve={virusTotalMetadata}
                        errorElement={<VirusTotalPaperErrorElement />}
                        children={(metadata) => (
                            <VirusTotalPaper metadata={metadata} />
                        )}
                    />
                </React.Suspense>

            </Box>
        </React.Fragment>
    )
}

export default VirusTotalSummary;