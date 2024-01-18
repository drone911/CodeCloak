import React from 'react';
import { Await, useLoaderData } from 'react-router-dom';

import { Container, Paper, Typography, Box, Stack, Button, Link, Stepper, Step, StepLabel, StepContent } from '@mui/material';
import { OpenInNew, Loop } from '@mui/icons-material'


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