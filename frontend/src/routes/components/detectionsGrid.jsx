import React from "react"
import { styled, Box, Typography, Unstable_Grid2 as Grid, Tooltip, Stack, Skeleton } from "@mui/material"
import { MoreHoriz } from "@mui/icons-material";

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

const DetectionsFoundGrid = ({ scanMetadata }) => {
    return (<React.Fragment>

        {scanMetadata.data[0].detections.map((detection, index) => (
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

                    <Skeleton></Skeleton>
                </Grid>
                <Grid xs={11} md={11.5} sx={{ paddingY: 1, borderLeft: "1px solid var(--ds-border,#ebecf0)" }}>
                    <Stack spacing={2}>
                        <Box
                            style={{
                                backgroundColor: 'white',
                                paddingLeft: "1rem"
                            }}
                        >
                            <Skeleton></Skeleton>
                        </Box>
                    </Stack>
                </Grid>
            </React.Fragment>
        ))
        }
    </React.Fragment>)

}

export { DetectionsFoundGrid, DetectionsNotFoundGrid, DetectionsGridSkeleton };