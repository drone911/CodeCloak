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
    { id: 'sha256', label: 'Sha 256 Hash', maxWidth: "8rem" },
    {
        id: 'detections',
        label: 'Detections',
        minWidth: "4.5rem",
        align: 'right',
        format: (value) => value.toLocaleString('en-US')
    },
    {
        id: 'size',
        label: 'Size\u00a0(Bytes)',
        align: 'right',
        format: (value) => value.toLocaleString('en-US')
    },
    { id: 'common_name', label: 'Common Name' },
];

function createData(sha256, size, detections, common_name) {
    size = numeral(size).format("0.0b");
    detections = numeral(detections).format("a");
    if (!common_name) {
        common_name = "Not available"
    }
    return { sha256, size, detections, common_name };
}

// let rows = [
//     createData('Lockbit 2.0', 'f5f35e3cc7e63f627d2794f73513a80c1b76bd4aa265b3681e39595c4956b5c7', 1324171354, 3287263),
//     createData('Win/Stuxnet', 'f5f35e3cc7e63f627d2794f73513a80c1b76bd4aa265b3681e39595c4956b5c7', 1403500365, 9596961),
//     createData('Win/Stuxnet2', 'f5f35e3cc7e63f627d2794f73513a80c1b76bd4aa265b3681e39595c4956b5c7', 60483973, 301340),
//     createData('Win/Stuxnet3', 'f5f35e3cc7e63f627d2794f73513a80c1b76bd4aa265b3681e39595c4956b5c7', 327167434, 9833520),
// ];


const RecentFiles = () => {
    const data = useLoaderData();
    const recentFilesResponse = data.recent_uploads;

    return (
        <TableContainer sx={{ maxHeight: "50vh" }}>
            <Table stickyHeader aria-label="sticky table">
                <TableHead>
                    <StyledTableRow>
                        {columns.map((column) => (
                            <StyledTableCell
                                key={column.id}
                                style={{ minWidth: column.minWidth, maxWidth: column.maxWidth }}
                                sx={{ maxWidth: "3rem", textOverflow: "ellipsis", overflow: 'hidden' }}
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
                                    return createData(recentFile.sha256hash, recentFile.size, recentFile.detectionsCount, recentFile.commonName);
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