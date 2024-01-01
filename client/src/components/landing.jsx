import React, { useState } from 'react';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { Snackbar, Alert } from '@mui/material';


const MAX_UPLOAD_FILE_SIZE = 5000000
const BACKEND_URL = "http://localhost:5000"

const Landing = ({ isSmallScreen }) => {
    const [showMaxUploadLimitExceedSnackbar, setShowMaxUploadLimitExceedSnackbar] = useState(false);
    const [showUploadFailedSnackbar, setShowUploadFailedSnackbar] = useState(false);

    const [uploadProgress, setUploadProgress] = useState(0)

    const onFileUpload = async (event) => {
        const file = event.target.files[0];

        if (!file) {
            return;
        }

        if (file.size > MAX_UPLOAD_FILE_SIZE) {
            setShowMaxUploadLimitExceedSnackbar(true);
            return;
        }

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await axios.post(`${BACKEND_URL}/api/upload`, formData, {
                onUploadProgress: (progressEvent) => {
                    const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                    setUploadProgress(progress);
                },
            });

            console.log('API Response:', response.data);

            setUploadComplete(true);

            setTimeout(() => {
                history.push('/detect/:fileHash/');
            }, 2000);
        } catch (error) {
            console.error('Error uploading file:', error);
            setShowUploadFailedSnackbar(true)
        }

    }

    const handleSnackbarClose = (event, reason) => {
        if (reason == 'clickaway') {
            return;
        }
        setShowSnackbar(false);
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
                            <Button type="submit" variant="contained">
                                Upload Now
                            </Button>
                        </div>
                    )}
                </Grid>
            </Grid>
            <Snackbar open={showMaxUploadLimitExceedSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: '100%' }}>
                    File size should be less then {MAX_UPLOAD_FILE_SIZE / 1000000} MB
                </Alert>
            </Snackbar>
            <Snackbar open={showUploadFailedSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: '100%' }}>
                    Uploading file error, try again
                </Alert>
            </Snackbar>
        </Container>
    )
}

export default Landing;