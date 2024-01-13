import React from "react";
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, TablePagination, tableCellClasses, styled } from "@mui/material";
import { selectUploadedFileHashesArray } from '../../reducers/uploadedFilesSlice';
import { useSelector } from 'react-redux'


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
        id: 'size',
        label: 'Size\u00a0(Bytes)',
        minWidth: 5,
        align: 'right',
        format: (value) => value.toLocaleString('en-US'),
    },
    {
        id: 'detections',
        label: 'Detections',
        minWidth: 5,
        align: 'right',
        format: (value) => value.toFixed(2),
    },
    { id: 'common_name', label: 'Common Name', minWidth: 2 }
];

function createData(common_name, sha256, size, detections, code) {
    return { common_name, sha256, size, detections, code };
}

const rows = [
    createData('Lockbit 2.0', 'f5f35e3cc7e63f627d2794f73513a80c1b76bd4aa265b3681e39595c4956b5c7', 1324171354, 3287263, 1),
    createData('Win/Stuxnet', 'f5f35e3cc7e63f627d2794f73513a80c1b76bd4aa265b3681e39595c4956b5c7', 1403500365, 9596961, 2),
    createData('Win/Stuxnet2', 'f5f35e3cc7e63f627d2794f73513a80c1b76bd4aa265b3681e39595c4956b5c7', 60483973, 301340, 3),
    createData('Win/Stuxnet3', 'f5f35e3cc7e63f627d2794f73513a80c1b76bd4aa265b3681e39595c4956b5c7', 327167434, 9833520, 4),
];

const MyUploads = () => {
    const uploadedFileHashes = useSelector(selectUploadedFileHashesArray);

    return (
        <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
                <TableHead>
                    <StyledTableRow>
                        {columns.map((column) => (
                            <StyledTableCell
                                key={column.id}
                                align={column.align}
                                style={{ minWidth: column.minWidth, maxWidth: column.maxWidth }}
                                sx={{ maxWidth: "3rem", textOverflow: 'ellipsis', overflow: 'hidden' }}
                            >
                                {column.label}
                            </StyledTableCell>
                        ))}
                    </StyledTableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => {
                        return (
                            <StyledTableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                                {columns.map((column) => {
                                    const value = row[column.id];
                                    return (
                                        <StyledTableCell key={column.id} align={column.align} sx={{ maxWidth: column.maxWidth, textOverflow: 'ellipsis', overflow: 'hidden' }}>
                                            {column.format && typeof value === 'number'
                                                ? column.format(value)
                                                : value}
                                        </StyledTableCell>
                                    );
                                })}
                            </StyledTableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>)
}

export default MyUploads;