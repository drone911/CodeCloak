
import React from 'react';
import { DetectionsFoundGrid, DetectionsNotFoundGrid, DetectionsGridSkeleton } from "./detectionsGrid";

import { Await, useLoaderData, useOutletContext, useNavigate, useParams } from 'react-router-dom';
import { Button, Paper, Typography, Stack, Tooltip, Box, Avatar, IconButton, Link, Skeleton, ThemeProvider, createTheme } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2';

import { ContentCopy, KeyboardDoubleArrowDownRounded, PlagiarismSharp, Error, FirstPage } from '@mui/icons-material';
import numeral from 'numeral';
import { darkTheme, lightTheme } from '../../theme';

const CopyableBody1Text = ({ text, isSmallScreen }) => {
    const [copySuccess, setCopySuccess] = React.useState(false);
    let setCopyToDefaultTimerHandler;
    const handleCopyClick = () => {
        if (!navigator.clipboard) {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                setCopySuccess(true);
            } catch (err) {
                console.error('Unable to copy', err);
            }
            document.body.removeChild(textArea);
        } else {
            try {
                navigator.clipboard.writeText(text)
                setCopySuccess(true);
            } catch (err) {
                console.error('Unable to copy', err);
            }
        }
        if (setCopyToDefaultTimerHandler) {
            clearTimeout(setCopyToDefaultTimerHandler);
        }

        setCopyToDefaultTimerHandler = setTimeout(() => {
            setCopySuccess(false);
            setCopyToDefaultTimerHandler = undefined;
        }, 4000);

    };

    return (
        <Stack direction="row" spacing={0} alignItems="center" display="flex">

            <Tooltip title={text}>
                <Typography variant="body1" color="primary" onClick={handleCopyClick} sx={{
                    cursor: "pointer", maxWidth: isSmallScreen ? "40vw" : "45vw", overflow: 'hidden',
                    textOverflow: 'ellipsis'
                }}>
                    {text}
                </Typography>
            </Tooltip>
            <IconButton onClick={handleCopyClick} color="primary">
                <ContentCopy />
            </IconButton>
            {copySuccess && <Typography color="success">Copied!</Typography>}
        </Stack >
    );
};

const DetectionsError = ({ goToHome, isSmallScreen }) => {
    return (
        <Box px={3} paddingBottom={isSmallScreen ? 1.5 : 3}>
            <Box sx={{ paddingTop: "0.5rem", display: 'flex', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-start', flexDirection: "column" }}>
                    <Typography sx={{ fontWeight: "600", color: "var(--primary-text-dark-600)" }} variant="body2" >
                        File Sha256 Hash
                    </Typography>
                    <CopyableBody1Text text={useParams().hash} isSmallScreen={isSmallScreen} ></CopyableBody1Text>
                </Box>
                <Box sx={{ display: 'flex', alignContent: 'flex-end', flexDirection: "column", alignSelf: "flex-start" }}>
                    <Button size={isSmallScreen ? 'small' : "medium"} onClick={goToHome} variant="contained" color="success" startIcon={<FirstPage></FirstPage>} >Go Back</Button>
                </Box>
            </Box>
            <Box sx={{ display: "flex" }}>
                <img style={{ height: isSmallScreen ? "65vw" : "35vw", margin: "auto" }} src="/404-not-found.jpg" alt="404 not found" />

            </Box>
        </Box>
    )
}

const DetectionsSkeleton = ({ goToHome, isSmallScreen }) => {
    return (
        <React.Fragment>

            <Box px={3} paddingBottom={isSmallScreen ? 1.5 : 3}>
                <Box sx={{ paddingTop: "0.5rem", display: 'flex', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-start', flexDirection: "column" }}>
                        <Typography sx={{ fontWeight: "600", color: "var(--primary-text-dark-600)" }} variant="body2" >
                            File Sha256 Hash
                        </Typography>
                        <Skeleton height="2rem" sx={{ maxWidth: "50vw" }}></Skeleton>

                    </Box>
                    <Box sx={{ display: 'flex', alignContent: 'flex-end', flexDirection: "column", alignSelf: "flex-start" }}>
                        <Button size={isSmallScreen ? 'small' : "medium"} onClick={goToHome} variant="contained" color="success" startIcon={<FirstPage></FirstPage>} >Go Back</Button>
                    </Box>
                </Box>
                <Box sx={{ paddingTop: "0.5rem", display: 'flex', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-start', flexDirection: "column" }}>
                        <Typography sx={{ display: "inline", fontWeight: "600", color: "var(--primary-text-dark-600)" }} variant="body2" >
                            Detected Using
                        </Typography>
                        <Skeleton variant=""></Skeleton>
                    </Box>
                    <Box sx={{ display: 'flex', alignContent: 'flex-end', flexDirection: "column" }}>
                        <Typography sx={{ fontWeight: "600", color: "var(--primary-text-dark-600)" }} variant="body2" >
                            File Size
                        </Typography>
                        <Skeleton sx={{ maxWidth: "15rem" }}></Skeleton>
                    </Box>
                </Box>
            </Box>
            <Paper elevation={1} sx={{ mx: 3 }}>

                <Grid container sx={{ border: "1px solid var(--ds-border,#ebecf0)" }}>
                    <Grid container xs={12}>
                        <Grid xs={12} sx={{ border: "1px solid var(--ds-border,#ebecf0)", backgroundColor: "var(--ds-lightest-grey)" }}>
                            <Stack direction="row" display="flex" alignItems="center" paddingX={2} paddingY={1}>
                                <Skeleton variant="circular"></Skeleton>
                            </Stack>
                        </Grid>

                    </Grid>
                    <Grid id="detectionsGrid" container xs={12} sx={{ overflowY: "auto", maxHeight: "40vh" }}>
                        <DetectionsGridSkeleton></DetectionsGridSkeleton>
                    </Grid>
                    <Grid container xs={12}>
                        <Grid xs={12} sx={{ border: "1px solid var(--ds-border,#ebecf0)", backgroundColor: "var(--ds-lightest-grey)", paddingBottom: 1, paddingTop: 1.5, display: "flex", justifyContent: "center" }}>
                            <IconButton id="expandDetectionsButton" size="small" sx={{ border: "3px solid var(--ds-border,#ebecf0)", borderRadius: 1, marginY: "auto", paddingY: "2px", paddingX: "12px" }} aria-label="expand">
                                <KeyboardDoubleArrowDownRounded fontSize="inherit" />
                            </IconButton>
                        </Grid>

                    </Grid>

                </Grid>
            </Paper>
        </React.Fragment>
    )
}
const scaleScanAPIReponse = (scanAPIResponse, scale = 2) => {
    return scanAPIResponse.map((originalItem) => {
        const item = { ...originalItem };
        if (!item.detections) {
            return item;
        }
        const detections = item.detections;

        const scaledDetections = []
        for (let i = 0; i < scale; i++) {
            for (let j = 0; j < detections.length; j++) {
                scaledDetections.push(detections[j])
            }
        }
        item.detections = scaledDetections

        return item;
    })

};

const scrollToElement = (targetElementRef) => {
    const elementPosition = targetElementRef.getBoundingClientRect().top;
    const offset = window.scrollY;
    const newPosition = elementPosition + offset - window.innerHeight / 2;

    window.scrollTo({
        top: newPosition,
        behavior: 'smooth',
    });
}
const ShowDetections = ({ isSmallScreen }) => {

    const data = useLoaderData();
    const [darkMode] = useOutletContext();
    const navigate = useNavigate();
    const scanMetadata = data.scanMetadata;

    // Use this state to set the max height of the detections container
    const [detectionsMaxHeight, setDetectionsMaxHeight] = React.useState(40);

    const handleExpandDetectionsClick = () => {
        setDetectionsMaxHeight(detectionsMaxHeight + 40);
        setTimeout(() => {
            const expandScrollButtonRef = document.getElementById("expandDetectionsButton")
            console.log(expandScrollButtonRef);
            scrollToElement(expandScrollButtonRef)
        }, 0);
    }

    const bigTextTheme = darkMode ? createTheme(darkTheme) : createTheme(lightTheme);
    // bigTextTheme.typography.body1.fontSize = "2rem";\
    bigTextTheme.typography.body1 = {
        fontSize: '1.3rem',
        '@media (min-width:600px)': {
            fontSize: '1.5rem',
        },
    };
    bigTextTheme.typography.body2 = {
        fontSize: '1rem',
        '@media (min-width:600px)': {
            fontSize: '1.2rem',
        },
    };
    const goToHome = () => {
        navigate("/")
    }
    return (
        <ThemeProvider theme={bigTextTheme}>
            <React.Suspense fallback={<DetectionsSkeleton goToHome={goToHome} isSmallScreen={isSmallScreen}></DetectionsSkeleton>}>
                <Await
                    resolve={scanMetadata}
                    errorElement={<DetectionsError goToHome={goToHome} isSmallScreen={isSmallScreen} />}
                    children={
                        (metadata) => {
                            if (metadata.data.error) {
                                return (
                                    <DetectionsError goToHome={goToHome} isSmallScreen={isSmallScreen}></DetectionsError>
                                )
                            }
                            return (
                                <React.Fragment>
                                    <Box px={3} paddingBottom={isSmallScreen ? 1.5 : 3}>
                                        <Box sx={{ paddingTop: "0.5rem", display: 'flex', justifyContent: 'space-between' }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'flex-start', flexDirection: "column" }}>
                                                <Typography sx={{ fontWeight: "600", color: "var(--primary-text-dark-600)" }} variant="body2" >
                                                    File Sha256 Hash
                                                </Typography>
                                                <CopyableBody1Text text={metadata.data[0].hash} isSmallScreen={isSmallScreen} ></CopyableBody1Text>
                                            </Box>
                                            <Box sx={{ display: 'flex', alignContent: 'flex-end', flexDirection: "column", alignSelf: "flex-start" }}>
                                                <Button size={isSmallScreen ? 'small' : "medium"} onClick={goToHome} variant="contained" color="success" startIcon={<FirstPage></FirstPage>} >Go Back</Button>
                                            </Box>
                                        </Box>
                                        <Box sx={{ paddingTop: "0.5rem", display: 'flex', justifyContent: 'space-between' }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'flex-start', flexDirection: "column" }}>
                                                <Typography sx={{ display: "inline", fontWeight: "600", color: "var(--primary-text-dark-600)" }} variant="body2" >
                                                    Detected Using
                                                </Typography>
                                                <Link href={metadata.data[0].scannerHome} underline='none' rel="noopener, noreferrer" target="_blank" sx={{ flexGrow: 1 }}>

                                                    <Tooltip sx={{ zIndex: 1 }} title={metadata.data[0].scanner}>
                                                        <Avatar alt={`Scanned by ${metadata.data[0].scanner}`}
                                                            src={metadata.data[0].scannerLogo}
                                                            sx={{
                                                                width: isSmallScreen ? "3.2rem" : "4.5rem",
                                                                height: isSmallScreen ? "3.2rem" : "4.5rem",

                                                                boxShadow: "0px 3px 3px -2px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 1px 8px 0px rgba(0,0,0,0.12)",
                                                                transition: "transform 0.1s ease-out",
                                                                "&:hover": {
                                                                    transform: "scale(1.05)"
                                                                }
                                                            }}
                                                        >
                                                        </Avatar>
                                                    </Tooltip>
                                                </Link>
                                            </Box>
                                            <Box sx={{ display: 'flex', alignContent: 'flex-end', flexDirection: "column" }}>
                                                <Typography sx={{ fontWeight: "600", textAlign: "end", color: "var(--primary-text-dark-600)" }} variant="body2" >
                                                    File Size
                                                </Typography>
                                                <Typography variant='body1'>
                                                    {numeral(metadata.data[0].size).format('0b')} / {metadata.data[0].size} Bytes
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                    <Paper elevation={1} sx={{ mx: 3 }}>

                                        <Grid container sx={{ border: "1px solid var(--ds-border,#ebecf0)" }}>
                                            <Grid container xs={12}>
                                                <Grid xs={12} sx={{ border: "1px solid var(--ds-border,#ebecf0)", backgroundColor: "var(--ds-lightest-grey)" }}>
                                                    <Stack direction="row" display="flex" alignItems="center" paddingX={2} paddingY={1}>
                                                        <PlagiarismSharp sx={{ fontWeight: "600", color: metadata.data[0].detections ? "red" : "green" }}></PlagiarismSharp>
                                                        <Typography variant='body2' sx={{ paddingLeft: "0.5rem", fontWeight: 600 }}>
                                                        </Typography>
                                                        <Typography variant='body2' sx={{ paddingLeft: "0.5rem", fontWeight: 600, color: "var(--primary-text-dark-700)" }}>
                                                            {metadata.data[0].detections && metadata.data[0].detections.length ? metadata.data[0].detections.length : 0} detections
                                                        </Typography>
                                                    </Stack>
                                                </Grid>

                                            </Grid>
                                            <Grid id="detectionsGrid" container xs={12} sx={{
                                                overflowY: "auto", maxHeight: `${detectionsMaxHeight}vh`
                                            }}>
                                                {
                                                    metadata.data[0].detections && <DetectionsFoundGrid scanMetadata={metadata}></DetectionsFoundGrid>
                                                }
                                                {
                                                    !metadata.data[0].detections && <DetectionsNotFoundGrid scanMetadata={metadata}></DetectionsNotFoundGrid>
                                                }
                                            </Grid>
                                            <Grid container xs={12}>
                                                <Grid xs={12} sx={{ border: "1px solid var(--ds-border,#ebecf0)", backgroundColor: "var(--ds-lightest-grey)", paddingBottom: 1, paddingTop: 1.5, display: "flex", justifyContent: "center" }}>
                                                    <IconButton id="expandDetectionsButton" size="small" sx={{ border: "3px solid var(--ds-border,#ebecf0)", borderRadius: 1, marginY: "auto", paddingY: "2px", paddingX: "12px" }} aria-label="expand" onClick={handleExpandDetectionsClick}>
                                                        <KeyboardDoubleArrowDownRounded fontSize="inherit" />
                                                    </IconButton>
                                                </Grid>

                                            </Grid>

                                        </Grid>
                                    </Paper>
                                </React.Fragment>)
                        }
                    }
                />

            </React.Suspense>
        </ThemeProvider >
    )
}


export default ShowDetections;