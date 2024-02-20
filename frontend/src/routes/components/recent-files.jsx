import React from "react";

import { Await, useLoaderData } from "react-router-dom";
import numeral from "numeral";


import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Stack, tableCellClasses, styled, Skeleton, Typography, Link, Grid } from "@mui/material";
import LaunchIcon from "@mui/icons-material/Launch";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.primary.dark,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

const columns = [
    { id: 'sha256', label: 'Sha256 Hash', maxWidth: "8rem" },
    {
        id: 'detections',
        label: 'Detections',
        minWidth: "5rem",
        align: 'right',
        format: (value) => value.toLocaleString('en-US')
    },
    {
        id: 'size',
        label: 'Size\u00a0(Bytes)',
        align: 'right',
        format: (value) => value.toLocaleString('en-US')
    },
    { id: 'common_name', label: 'Common Name', maxWidth: "8rem" },
];

function toHumanReadable(sha256, size, detections, common_name) {
    size = numeral(size).format("0.0b");
    detections = numeral(detections).format("a");
    if (!common_name) {
        common_name = "Not available"
    }
    return { sha256, size, detections, common_name };
}


const RecentFiles = () => {
    const data = useLoaderData();
    const recentFilesResponse = data.recent_uploads;

    return (
        <TableContainer sx={{ maxHeight: "55vh" }}>
            <Table stickyHeader aria-label="sticky table">
                <TableHead>
                    <StyledTableRow>
                        {columns.map((column) => (
                            <StyledTableCell
                                key={column.id}
                                style={{ minWidth: column.minWidth, maxWidth: column.maxWidth }}
                                sx={{ maxWidth: "8rem", textOverflow: "ellipsis", overflow: 'none' }}
                            >
                                {column.label}
                            </StyledTableCell>
                        ))}
                    </StyledTableRow>
                </TableHead>
                <TableBody>
                    <React.Suspense
                        fallback={
                            <React.Fragment>
                                {Array.from({ length: 5 }).map((_, index) => {
                                    return (
                                        <StyledTableRow hover role="checkbox" tabIndex={-1} key={index}>
                                            {columns.map((column) => {
                                                return (
                                                    <StyledTableCell key={column.id}>
                                                        <Skeleton></Skeleton>
                                                    </StyledTableCell>
                                                );
                                            }
                                            )}
                                        </StyledTableRow>)
                                })}
                            </React.Fragment>
                        }
                    >
                        <Await
                            resolve={recentFilesResponse}
                            errorElement={
                                <Typography color="error" variant="body1" >
                                    Error
                                </Typography>
                            }
                            children={(recentFilesResponse) => {
                                let rows = recentFilesResponse.data.map((recentFile) => {
                                    return toHumanReadable(recentFile.sha256hash, recentFile.size, recentFile.detectionsCount, recentFile.commonName);
                                })
                                return rows.map((row, index) => {
                                    return (
                                        <StyledTableRow hover role="checkbox" tabIndex={-1} key={index}>
                                            {
                                                columns.map((column) => {
                                                    const value = row[column.id];
                                                    return (
                                                        <StyledTableCell key={column.id} align={column.align} sx={{ maxWidth: column.maxWidth, textOverflow: 'ellipsis', overflow: 'hidden' }}>
                                                            {
                                                                column.id !== "sha256" && (
                                                                    column.format && typeof value === 'number'
                                                                        ? column.format(value)
                                                                        : value
                                                                )}
                                                            {
                                                                (column.id == "sha256") && (
                                                                    <React.Fragment>

                                                                        < Link display="inline" href={`/detect/${row.sha256}`} rel="noopener, noreferrer" target="_blank">
                                                                            <Grid container>
                                                                                <Grid xs={10} sx={{ maxWidth: column.maxWidth, textOverflow: 'ellipsis', overflow: 'hidden' }}>
                                                                                    {column.format && typeof value === 'number'
                                                                                        ? column.format(value)
                                                                                        : value}

                                                                                </Grid>
                                                                                <Grid xs={2}>
                                                                                    <LaunchIcon sx={{ display: "inline" }}></LaunchIcon>
                                                                                </Grid>
                                                                            </Grid>
                                                                        </Link>

                                                                    </React.Fragment>
                                                                )
                                                            }
                                                        </StyledTableCell>
                                                    );
                                                })
                                            }
                                        </StyledTableRow>
                                    );
                                })
                            }}
                        />
                    </React.Suspense>
                </TableBody>
            </Table>
        </TableContainer >)
}

export default RecentFiles;