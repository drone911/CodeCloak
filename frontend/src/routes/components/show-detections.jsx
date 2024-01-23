
import React from 'react';

import { Paper, Typography, Stack, Tooltip, Box, styled, Avatar, IconButton, Link } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2';

import { CopyAll } from '@mui/icons-material';
import numeral from 'numeral';

const HoverSpan = styled('span')({
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
                <CopyAll />
            </IconButton>
            {copySuccess && <Typography color="success">Copied!</Typography>}
        </Stack >
    );
};

const scaleScanAPIReponse = (scanAPIResponse, scale = 2) => {
    return scanAPIResponse.map((originalItem) => {
        const item = { ...originalItem };
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

const ShowDetections = ({ scanAPIResponse, isSmallScreen }) => {

    const detections = scaleScanAPIReponse(scanAPIResponse, 5)[0].detections;

    return (
        <Box paddingBottom={5}>

            <Typography variant="h4" px={3} paddingTop={isSmallScreen ? 1.5 : 3} paddingBottom={1} textAlign={isSmallScreen ? "center" : "start"} >
                Detections
            </Typography>
            <Box px={3} paddingBottom={isSmallScreen ? 1.5 : 3}>
                <Typography sx={{ fontWeight: "600", color: "var(--primary-text-dark-600)" }} variant="body2" >
                    File Sha256 Hash
                </Typography>
                <CopyableBody1Text text={scanAPIResponse[0].hash} ></CopyableBody1Text>
                <Typography sx={{ fontWeight: "600", color: "var(--primary-text-dark-600)" }} variant="body2" >
                    File Size
                </Typography>

                <Typography variant="body1" >
                    {numeral(scanAPIResponse[0].size).format('0b')} ({scanAPIResponse[0].size} Bytes)
                </Typography>

            </Box>
            <Paper elevation={3} sx={{ mx: 3 }}>

                <Grid container sx={{ border: "1px solid var(--ds-border,#ebecf0)" }}>
                    <Grid container xs={12}>
                        <Grid xs={1} sx={{ border: "1px solid var(--ds-border,#ebecf0)", backgroundColor: "var(--ds-lightest-grey)" }}>
                            Up Arrow
                        </Grid>
                        <Grid xs={11} sx={{ border: "1px solid var(--ds-border,#ebecf0)", backgroundColor: "var(--ds-lightest-grey)" }}>
                            <Stack direction="row" display="flex" alignItems="center" paddingX={1} paddingY={1}>
                                <Typography sx={{ fontWeight: "600", color: "var(--primary-text-dark-600)" }} variant="body2" >
                                    Detected by:
                                </Typography>
                                <Link href={scanAPIResponse[0].scannerHome} underline='none' rel="noopener, noreferrer" target="_blank" sx={{ flexGrow: 1 }}>
                                    <Tooltip title={scanAPIResponse[0].scanner}>
                                        <Avatar alt={`Scanned by ${scanAPIResponse[0].scanner}`}
                                            src={scanAPIResponse[0].scannerLogo}
                                            sx={{
                                                width: "4rem", height: "4rem",
                                                border: "2px white solid",
                                                marginX: "auto",
                                                transform: "translateX(-3rem)",
                                                boxShadow: "0px 3px 3px -2px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 1px 8px 0px rgba(0,0,0,0.12)",
                                                transition: "transform 0.1s ease-out",
                                                "&:hover": {
                                                    transform: "translateX(-3rem) scale(1.1)"
                                                }
                                            }}
                                        >
                                        </Avatar>
                                    </Tooltip>
                                </Link>
                            </Stack>

                        </Grid>

                    </Grid>
                    <Grid container xs={12} sx={{ overflow: "auto", maxHeight: "80vh" }}>
                        {detections.map((detection, index) => (
                            <React.Fragment key={index}>

                                <Grid xs={1} sx={{ paddingTop: 1, borderInline: "1px solid var(--ds-border,#ebecf0)", backgroundColor: "var(--ds-lightest-grey)" }}>
                                    Indexes
                                </Grid>
                                <Grid xs={11} sx={{ paddingTop: 1, borderLeft: "1px solid var(--ds-border,#ebecf0)" }}>
                                    <Stack spacing={2}>
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
                                            <Tooltip
                                                title={`Start Index: ${detection.startIndex}, End Index: ${detection.endIndex}`}
                                                arrow
                                            >
                                                <HoverSpan style={{
                                                    backgroundColor: 'var(--ds-background-red-light)'
                                                }}>
                                                    {detection.content.substring(
                                                        detection.offset,
                                                        detection.content.length - detection.offset
                                                    )}
                                                </HoverSpan>
                                            </Tooltip>
                                            <span style={{
                                                backgroundColor: 'var(--ds-background-green-subtle)'
                                            }}>
                                                {detection.content.substring(
                                                    detection.content.length - detection.offset + 1
                                                )}
                                            </span>
                                        </Box>
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
        </Box >
    )
}


export default ShowDetections;