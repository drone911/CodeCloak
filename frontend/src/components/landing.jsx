import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';

import { Snackbar, Alert } from '@mui/material';


import axios from 'axios'


const MAX_UPLOAD_FILE_SIZE = 5000000

const Landing = ({ isSmallScreen }) => {
    const [showFileSizeErrorSnackbar, setShowFileSizeErrorSnackbar] = useState(false);
    const [showFileUploadErrorSnackbar, setShowFileUploadErrorSnackbar] = useState(false);

    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadComplete, setUploadComplete] = useState(false);

    const onFileUpload = async (event) => {
        const file = event.target.files[0];

        if (!file) {
            return;
        }

        if (file.size > MAX_UPLOAD_FILE_SIZE) {
            setShowFileSizeErrorSnackbar(true);
            return;
        }
        try {
            setSelectedFile(file)
            const formData = new FormData();
            formData.append('file', file);

            const response = await axios.post(`${process.env.REACT_APP_API_URL}/upload`, formData, {
                onUploadProgress: (progressEvent) => {
                    const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                    setUploadProgress(progress);
                },
            });
            setUploadComplete(true);

            console.log('API Response:', response.data);
            

        } catch (error) {
            console.error('Error uploading file:', error);
            setShowFileUploadErrorSnackbar(true);
        }

    }

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setShowFileSizeErrorSnackbar(false);
        setShowFileUploadErrorSnackbar(false);
    }

    return (
        <Container sx={{ paddingTop: 4 }}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Typography variant={isSmallScreen ? 'h2' : 'h1'} sx={{ fontWeight: '400' }}>Catch</Typography>
                    <Typography variant={isSmallScreen ? 'h2' : 'h1'} sx={{ fontWeight: '400' }} color='secondary'>Code Signatures</Typography>
                    <Typography variant={isSmallScreen ? 'h2' : 'h1'} sx={{ fontWeight: '400' }}>Caught by</Typography>
                    <Typography variant={isSmallScreen ? 'h2' : 'h1'} sx={{ fontWeight: '400' }} color='secondary'>Antivirus</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                    <input type="file" id="file-upload" onChange={onFileUpload} style={{ display: 'none' }} />
                    <label htmlFor="file-upload">
                        <Typography variant="body1" sx={{ cursor: 'pointer' }}>
                            <CloudUploadIcon sx={{ marginRight: 1 }} />
                            Upload File
                        </Typography>
                    </label>
                    {selectedFile && (
                        <div>
                            <LinearProgress variant="determinate" value={uploadProgress} />
                        </div>
                    )}
                </Grid>
            </Grid>
            <Snackbar open={showFileSizeErrorSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: '100%' }}>
                    File size should be less then {MAX_UPLOAD_FILE_SIZE / 1000000} MB
                </Alert>
            </Snackbar>
            <Snackbar open={showFileUploadErrorSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: '100%' }}>
                    Error uploading file
                </Alert>
            </Snackbar>

        </Container>
    )
}

export default Landing;