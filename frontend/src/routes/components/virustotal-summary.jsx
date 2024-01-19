import React from 'react';
import { Await, useLoaderData } from 'react-router-dom';

import { Container, Paper, Typography, Box, Stack, Button, Link, Stepper, Step, StepLabel, StepContent, Chip, List } from '@mui/material';
import { OpenInNew, Loop } from '@mui/icons-material'

const reputationMap = {
    "[50, 100]": {
        "reputationText": "Benign & Trusted",
        "reputationColor": "green",
        "reputationBackgroundColor": "lightgreen"
    },
    "[0, 50)": {
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
        label: 'Upload File On Virustotal',
        description: `First we upload the file on VirusTotal.`,
    },
    {
        label: 'Refresh Content',
        description:
            'Next we refresh the page.',
    },
];

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
                                <Link href={virusTotalUploadLink} underline='none' rel="noopener" target="_blank" rel="noreferrer">
                                    <Button variant="contained" size="medium" endIcon={<OpenInNew />}>
                                        Upload on Virustotal
                                    </Button>
                                </Link>

                            )}
                            {activeStep == 1 && (
                                <Button variant="contained" onClick={() => { window.location.reload() }} size="medium" color="success" endIcon={<Loop />}>
                                    Reload Page
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

const VirusTotalPaper = ({ metadata }) => {
    const reputation = Number(metadata.data.reputation);
    let reputationText, reputationColor, reputationBackgroundColor;

    if (reputation <= -50) {
        ({ reputationText, reputationColor, reputationBackgroundColor } = reputationMap["[-100, -50]"]);
    } else if (reputation < 0) {
        ({ reputationText, reputationColor, reputationBackgroundColor } = reputationMap["(-50,0)"]);
    } else if (reputation < 50) {
        ({ reputationText, reputationColor, reputationBackgroundColor } = reputationMap["[0, 50)"]);
    } else {
        ({ reputationText, reputationColor, reputationBackgroundColor } = reputationMap["[50, 100]"]);
    }


    return (
        <Box sx={{ maxWidth: 400 }} my={4} mx={3}>
            TODO: {JSON.stringify(metadata.data)}

            <Stack spacing={1}>

                <Box display="flex" flexDirection="column">
                    <Typography variant="body2" sx={{ fontWeight: "600" }}>
                        Reputation
                    </Typography>
                    <Button px={3} py={2} variant="contained" sx={{
                        '&:hover': {
                            backgroundColor: reputationBackgroundColor,
                            boxShadow: "0px 3px 1px -2px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12)",
                            cursor: "default"
                        }, color: reputationColor, backgroundColor: reputationBackgroundColor
                    }}>
                        <Typography variant='h6'>
                            {reputationText}
                        </Typography>
                    </Button>
                </Box>
                {
                    metadata.data.names && <Box>
                        <Typography variant="body2" sx={{ fontWeight: "600" }}>
                            Names
                        </Typography>
                        <List>
                            {metadata.data.names.map((name) => {
                                return (
                                    <Chip size="medium" color="primary" label={name} variant="outlined" sx={{ scale: "1.1" }}></Chip>
                                )
                            })}
                        </List>

                    </Box>
                }
                {
                    metadata.data.tags &&
                    <Box>

                        <Typography variant="body2" sx={{ fontWeight: "600" }}>
                            Associated Tags
                        </Typography>
                        <List>
                            {metadata.data.tags.map((name) => {
                                return (
                                    <Chip size="medium" label={name} color="primary" variant="outlined" sx={{ scale: "1.1" }}></Chip>
                                )
                            })}
                        </List>

                    </Box>
                }
                {
                    metadata.data.typeTags &&
                    <Box>

                        <Typography variant="body2" sx={{ fontWeight: "600" }}>
                            Detected File Types
                        </Typography>
                        <List>
                            {metadata.data.typeTags.map((name) => {
                                return (
                                    <Chip size="medium" label={name} color="primary" variant="outlined" sx={{ scale: "1.1" }}></Chip>
                                )
                            })}
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