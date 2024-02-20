import React from "react"
import { styled, Box, Typography, Unstable_Grid2 as Grid, Stack, Skeleton } from "@mui/material"
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';

const CodeSpan = styled('span')({
    borderRadius: "4px",
    padding: "1px 3px 1px 3px",
    fontSize: "0.9rem",
    '@media (min-width:600px)': {
        fontSize: '1.1rem',
    },
    wordWrap: "break-word",
    margin: "0px",
    marginX: "2px"
});

const HoverSpan = styled(CodeSpan)({
    transition: "font-size 0.3s ease, box-shadow 0.2s ease-out",
    boxShadow: "0px 3px 3px -2px rgba(0,0,0,0.2)",
    '&:hover': {
        boxShadow: "0px 3px 3px -2px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 1px 8px 0px rgba(0,0,0,0.12)"
    },
});

const HtmlTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: "rgba(0, 0, 0, 0.90)",
        maxWidth: 220,
        fontSize: "5px",
        border: '1px solid #dadde9',
    },
}));

const DetectionsFoundGrid = ({ scanMetadata }) => {
    return (<React.Fragment>

        {scanMetadata.data[0].detections && scanMetadata.data[0].detections.map((detection, index) => (
            <React.Fragment key={index + 1}>
                <Grid item xs={1.5} md={0.5} sx={{ paddingTop: 1, borderInline: "1px solid var(--ds-border,#ebecf0)", backgroundColor: "var(--ds-lightest-grey)", display: "flex", alignContent: "center", justifyContent: "center" }}>

                    <Typography variant="h5" sx={{ fontSize: "1.1rem", paddingTop: "6px", fontWeight: "500", color: "var(--lt-color-gray-600)" }}>
                        {index + 1}.
                    </Typography>
                </Grid>
                <Grid item xs={10.5} md={11.5} sx={{
                    paddingY: 1, borderLeft: "1px solid var(--ds-border,#ebecf0)"
                }}>
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
                            <HtmlTooltip
                                title={
                                    <Typography color="white">

                                        <Typography variant="h3" sx={{ fontSize: "0.8rem", fontWeight: 400, marginTop: "0.3rem" }}>
                                            Start Index Offset:
                                        </Typography>
                                        <Typography variant="h3" fontWeight={500} fontSize="1.1rem" >
                                            {detection.startIndex.toLocaleString()}
                                        </Typography>
                                        <Typography variant="h3" sx={{ fontSize: "0.8rem", fontWeight: 400, marginTop: "0.3rem" }}>
                                            End Index Offset:
                                        </Typography>
                                        <Typography variant="h3" fontWeight={500} fontSize="1.1rem" marginBottom="0.2rem" >
                                            {detection.endIndex.toLocaleString()}
                                        </Typography>

                                    </Typography>
                                }
                                arrow
                                leaveDelay={500}
                            >
                                <HoverSpan style={{
                                    backgroundColor: 'var(--ds-background-red-light)'
                                }}>
                                    {detection.maliciousContent}
                                </HoverSpan>
                                {
                                    detection.maliciousContentContinue &&

                                    <React.Fragment>
                                        <span style={{
                                            display: "inline-block",
                                            marginLeft: "0.3rem",
                                            marginRight: "0.3rem",
                                            fontWeight: "400",
                                            fontSize: "1.3rem",
                                            '@media (min-width:600px)': {
                                                fontSize: '1.3rem',
                                            }
                                        }} >
                                            ...
                                        </span>
                                        <HoverSpan style={{
                                            backgroundColor: 'var(--ds-background-red-light)'
                                        }}>
                                            {detection.maliciousContentContinue}
                                        </HoverSpan>
                                    </React.Fragment>
                                }

                            </HtmlTooltip>
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
    </React.Fragment>)
}

const DetectionsNotFoundGrid = ({ scanMetadata }) => {
    return (<React.Fragment key={0}>

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
                        {scanMetadata.data[0].fileHeader}
                    </CodeSpan>
                    {scanMetadata.data[0].size > scanMetadata.data[0].fileHeader.length &&
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
    </React.Fragment>)

}

const DetectionsGridSkeleton = () => {
    return (<React.Fragment>
        {Array.from({ length: 5 }, (_, index) => (
            <React.Fragment key={index}>

                <Grid xs={1} md={0.5} sx={{ paddingTop: 1, borderInline: "1px solid var(--ds-border,#ebecf0)", backgroundColor: "var(--ds-lightest-grey)", display: "flex", alignContent: "center", justifyContent: "center" }}>

                </Grid>
                <Grid xs={11} md={11.5} sx={{ paddingY: 1, borderLeft: "1px solid var(--ds-border,#ebecf0)" }}>
                    <Stack spacing={2}>
                        <Box
                            style={{
                                backgroundColor: 'white',
                                paddingLeft: "1rem"
                            }}
                        >
                            <Skeleton sx={{ maxWidth: "95%" }}></Skeleton>
                        </Box>
                    </Stack>
                </Grid>
            </React.Fragment>
        ))
        }
    </React.Fragment>)

}

export { DetectionsFoundGrid, DetectionsNotFoundGrid, DetectionsGridSkeleton };