
import React from 'react';

import { Await, useLoaderData, useOutletContext } from 'react-router-dom';
import { Paper, Typography, Stack, Tooltip, Box, styled, Avatar, IconButton, Link, Skeleton, ThemeProvider, useTheme, createTheme } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2';

import { ContentCopy, KeyboardDoubleArrowDownRounded, Plagiarism, PlagiarismOutlined, PlagiarismSharp, MoreHoriz } from '@mui/icons-material';
import numeral from 'numeral';
import { darkTheme, lightTheme } from '../../theme';

const CodeSpan = styled('span')({
    borderRadius: "4px",
    padding: "1px 3px 1px 3px",
    fontSize: "1.1rem",
    '@media (min-width:600px)': {
        fontSize: '1.3rem',
    },

    margin: "0px"
});

const HoverSpan = styled(CodeSpan)({
    transition: "font-size 0.3s ease, box-shadow 0.2s ease-out",
    boxShadow: "0px 3px 3px -2px rgba(0,0,0,0.2)",
    '&:hover': {
        boxShadow: "0px 3px 3px -2px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 1px 8px 0px rgba(0,0,0,0.12)"
    },
});

const CopyableBody1Text = ({ text }) => {
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
                    cursor: "pointer", maxWidth: "45vw", overflow: 'hidden',
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
const ShowDetections = ({ scanAPIResponse, isSmallScreen }) => {

    let scanAPIReponse = scaleScanAPIReponse(scanAPIResponse, 5)[0];
    const data = useLoaderData();
    const [darkMode] = useOutletContext();

    let detections = scanAPIReponse.detections;
    if (detections == undefined) {
        detections = [];
    }
    let isFileMalcious = detections.length <= 0 ? false : true;

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
    return (
        <ThemeProvider theme={bigTextTheme}>

            <Box px={3} paddingBottom={isSmallScreen ? 1.5 : 3}>
                <Typography sx={{ fontWeight: "600", color: "var(--primary-text-dark-600)" }} variant="body2" >
                    File Sha256 Hash
                </Typography>
                <CopyableBody1Text text={scanAPIResponse[0].hash} ></CopyableBody1Text>
                <Box sx={{ paddingTop: "0.5rem", display: 'flex', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-start', flexDirection: "column" }}>
                        <Typography sx={{ display: "inline", fontWeight: "600", color: "var(--primary-text-dark-600)" }} variant="body2" >
                            Detected by
                        </Typography>
                        <Link href={scanAPIResponse[0].scannerHome} underline='none' rel="noopener, noreferrer" target="_blank" sx={{ flexGrow: 1 }}>

                            <Tooltip sx={{ zIndex: 1 }} title={scanAPIResponse[0].scanner}>
                                <Avatar alt={`Scanned by ${scanAPIResponse[0].scanner}`}
                                    src={scanAPIResponse[0].scannerLogo}
                                    sx={{
                                        width: "3rem",
                                        height: "3rem",

                                        boxShadow: "0px 3px 3px -2px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 1px 8px 0px rgba(0,0,0,0.12)",
                                        transition: "transform 0.1s ease-out",
                                        "&:hover": {
                                            transform: "scale(1.1)"
                                        }
                                    }}
                                >
                                </Avatar>
                            </Tooltip>
                        </Link>
                    </Box>
                    <Box sx={{ display: 'flex', alignContent: 'flex-end', flexDirection: "column" }}>
                        <Typography sx={{ fontWeight: "600", color: "var(--primary-text-dark-600)" }} variant="body2" >
                            File Size
                        </Typography>
                        <React.Suspense fallback={<Skeleton sx={{ maxWidth: "10rem" }}></Skeleton>}>
                            <Await
                                resolve={scanMetadata}
                                errorElement={
                                    <Typography color="error" variant="body1" >
                                        Error
                                    </Typography>
                                }
                                children={(metadata) => (
                                    <Typography variant="body1" >
                                        {numeral(metadata.data[0].size).format('0b')} ({metadata.data[0].size} Bytes)
                                    </Typography>
                                )}
                            />
                        </React.Suspense>
                    </Box>
                </Box>
            </Box>
            <Paper elevation={1} sx={{ mx: 3 }}>

                <Grid container sx={{ border: "1px solid var(--ds-border,#ebecf0)" }}>
                    <Grid container xs={12}>
                        <Grid xs={12} sx={{ border: "1px solid var(--ds-border,#ebecf0)", backgroundColor: "var(--ds-lightest-grey)" }}>
                            <Stack direction="row" display="flex" alignItems="center" paddingX={2} paddingY={1}>
                                <PlagiarismSharp sx={{ fontWeight: "600", color: isFileMalcious ? "red" : "green" }}></PlagiarismSharp>
                                <Typography variant='body2' sx={{ paddingLeft: "0.5rem", fontWeight: 600 }}>
                                </Typography>
                                <Typography variant='body2' sx={{ paddingLeft: "0.5rem", fontWeight: 600, color: "var(--primary-text-dark-700)" }}>
                                    {detections.length} Detections
                                </Typography>
                            </Stack>
                        </Grid>

                    </Grid>
                    <Grid id="detectionsGrid" container xs={12} sx={{ overflow: "auto", maxHeight: `${detectionsMaxHeight}vh` }}>
                        {isFileMalcious && detections.map((detection, index) => (
                            <React.Fragment key={index}>

                                <Grid xs={1} md={0.5} sx={{ paddingTop: 1, borderInline: "1px solid var(--ds-border,#ebecf0)", backgroundColor: "var(--ds-lightest-grey)", display: "flex", alignContent: "center", justifyContent: "center" }}>
                                    <Typography variant="h5" sx={{ fontSize: "1.1rem", paddingTop: "6px", fontWeight: "500", color: "var(--lt-color-gray-600)" }}>
                                        {index}.
                                    </Typography>
                                </Grid>
                                <Grid xs={11} md={11.5} sx={{ paddingY: 1, borderLeft: "1px solid var(--ds-border,#ebecf0)" }}>
                                    <Stack spacing={2}>
                                        <Box
                                            style={{
                                                backgroundColor: 'white',
                                                paddingLeft: "1rem"
                                            }}
                                        >
                                            <CodeSpan style={{ backgroundColor: "var(--ds-background-green-subtle)" }}>
                                                {detection.paddedContentBefore}
                                            </CodeSpan>
                                            <Tooltip
                                                title={`Start Index: ${detection.startIndex}, End Index: ${detection.endIndex}`}
                                                arrow
                                            >
                                                <HoverSpan style={{
                                                    backgroundColor: 'var(--ds-background-red-light)'
                                                }}>
                                                    {detection.maliciousContent}
                                                </HoverSpan>
                                                {
                                                    detection.maliciousContentContinue &&

                                                    <React.Fragment>
                                                        <MoreHoriz sx={{
                                                            fontSize: "1.1rem",
                                                            '@media (min-width:600px)': {
                                                                fontSize: '1.3rem',
                                                            },
                                                            marginX: "0.3rem"
                                                        }}></MoreHoriz>
                                                        <HoverSpan style={{
                                                            backgroundColor: 'var(--ds-background-red-light)'
                                                        }}>
                                                            {detection.maliciousContentContinue}
                                                        </HoverSpan>
                                                    </React.Fragment>
                                                }

                                            </Tooltip>
                                            <CodeSpan style={{
                                                backgroundColor: 'var(--ds-background-green-subtle)'
                                            }}>
                                                {detection.paddedContentAfter}
                                            </CodeSpan>
                                        </Box>
                                    </Stack>
                                </Grid>
                            </React.Fragment>
                        ))}
                        {!isFileMalcious &&
                            <React.Fragment key={0}>

                                <Grid xs={1} md={0.5} sx={{ paddingTop: 1, borderInline: "1px solid var(--ds-border,#ebecf0)", backgroundColor: "var(--ds-lightest-grey)", display: "flex", alignContent: "center", justifyContent: "center" }}>
                                    <Typography variant="h5" sx={{ fontSize: "1.1rem", paddingTop: "6px", fontWeight: "500", color: "var(--lt-color-gray-600)" }}>

                                    </Typography>
                                </Grid>
                                <Grid xs={11} md={11.5} sx={{ paddingY: 1, borderLeft: "1px solid var(--ds-border,#ebecf0)" }}>
                                    <Stack spacing={2}>
                                        <Box
                                            style={{
                                                backgroundColor: 'white',
                                                paddingLeft: "1rem"
                                            }}
                                        >
                                            <CodeSpan style={{ backgroundColor: "var(--ds-background-green-subtle)" }}>
                                                {scanAPIReponse.fileHeader}
                                            </CodeSpan>
                                            {scanAPIReponse.size > scanAPIReponse.fileHeader.length &&
                                                <span style={{
                                                    paddingLeft: "0.3rem",
                                                    fontWeight: "700",
                                                    fontSize: "1.3rem",
                                                    '@media (min-width:600px)': {
                                                        fontSize: '1.3rem',
                                                    }
                                                }} >
                                                    ...
                                                </span>
                                            }
                                        </Box>
                                    </Stack>
                                </Grid>
                            </React.Fragment>
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
        </ThemeProvider >
    )
}


export default ShowDetections;