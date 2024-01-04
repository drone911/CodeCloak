import React, { useState } from 'react';
import { Form, useNavigate, useSubmit } from 'react-router-dom';

import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import useMediaQuery from '@mui/material/useMediaQuery';
import { lightTheme } from '../theme';

import { Snackbar, Alert, Paper } from '@mui/material';


import axios from 'axios'

const Landing = () => {
    const [showFileSizeErrorSnackbar, setShowFileSizeErrorSnackbar] = useState(false);
    const [showFileUploadErrorSnackbar, setShowFileUploadErrorSnackbar] = useState(false);
    const isSmallScreen = useMediaQuery(lightTheme.breakpoints.down('sm'));
    const navigate = useNavigate();


    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadComplete, setUploadComplete] = useState(false);

    const onFileChange = async (event) => {
        const file = event.target.files[0];

        if (!file) {
            return;
        }

        if (file.size > Number(process.env.REACT_APP_MAX_UPLOAD_FILE_SIZE)) {
            setShowFileSizeErrorSnackbar(true);
            return;
        }
        setSelectedFile(file);
    }
    const onSelectFileClicked = (event) => {
        event.preventDefault();
        const fileUpload = document.getElementById("file-upload");
        fileUpload.click();
    }
    const handleFileUpload = async (event) => {
        event.preventDefault();

        try {
            const formData = new FormData();
            formData.append('file', selectedFile);
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/upload`, formData, {
                onUploadProgress: (progressEvent) => {
                    const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                    setUploadProgress(progress);
                },
            });
            setUploadComplete(true);
            console.log('API Response:', response.data);
            setTimeout(() => {
                navigate(`detect/${response.data["hash"]}`)
            }, 2000)
        } catch (error) {
            console.error('Error uploading file:', error);
            setShowFileUploadErrorSnackbar(true);
            // Reset Fields
            setSelectedFile(null)
            setUploadComplete(false)
            setUploadProgress(0)
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
                <Grid container display="flex" justifyContent="center" alignItems="center" xs={12} md={6}>
                    {/* <div
                        style={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(255, 255, 255, 0.3)', // Transparent white
                            zIndex: 1,
                        }}
                    ></div> */}
                    <Grid container spacing={3}>
                        <Grid item xs={6} md={6}>
                            <Paper elevation={3}>
                                <form onSubmit={handleFileUpload}>
                                    <input type="file" id="file-upload" onChange={onFileChange} style={{ display: 'none', zIndex: 1 }} />
                                    <Button variant="contained" onClick={onSelectFileClicked} htmlFor="file-upload" sx={{zIndex: 0}}>
                                        <LibraryAddIcon sx={{ marginRight: 1 }} />
                                        <Typography variant="body1" sx={{ cursor: 'pointer', zIndex: 2, position: 'relative' }}>
                                            Select File
                                        </Typography>
                                    </Button>
                                    {selectedFile && (
                                        <div style={{ zIndex: 2, position: 'relative' }}>
                                            <Typography variant="body1" sx={{ cursor: 'pointer', marginRight: 1 }}>
                                                {(selectedFile.name)}
                                            </Typography>
                                        </div>

                                    )}
                                    <Button type="submit" disabled={selectedFile === null ? true : false} variant="outlined">
                                        <CloudUploadIcon sx={{ marginRight: 1 }} />
                                        <Typography variant="body1" sx={{ cursor: 'pointer', marginRight: 1 }}>
                                            Upload
                                        </Typography>
                                    </Button>

                                    {uploadProgress !== 0 && (
                                        <div>
                                            <LinearProgress variant="determinate" value={uploadProgress} />
                                        </div>
                                    )}
                                </form>
                            </Paper>

                        </Grid>
                        <Grid item xs={6} md={6}>
                            <Paper>
                                <Button>wiejfeiwf</Button>
                            </Paper>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <Paper>
                            <Button>wiejfeiwf</Button>
                        </Paper>
                    </Grid>

                </Grid>
            </Grid>
            <Snackbar open={showFileSizeErrorSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: '100%' }}>
                    File size should be less then {process.env.REACT_APP_MAX_UPLOAD_FILE_SIZE / 1000000} MB
                </Alert>
            </Snackbar>
            <Snackbar open={showFileUploadErrorSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: '100%' }}>
                    Error uploading file, please try again
                </Alert>
            </Snackbar>

        </Container>
    )
}

export default Landing;