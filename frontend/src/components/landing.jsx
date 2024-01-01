import React, { useState } from 'react';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { Snackbar, Alert } from '@mui/material';


const MAX_UPLOAD_FILE_SIZE = 5000000

const Landing = ({ isSmallScreen }) => {
    const [showSnackbar, setShowSnackbar] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0)

    const onFileUpload = async (event) => {
        const file = event.target.files[0];

        if (!file) {
            return;
        }

        if (file.size > MAX_UPLOAD_FILE_SIZE) {
            setShowSnackbar(true);
            return;
        }
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await axios.post(`/api/projects/${projectId}/upload`, formData, {
                onUploadProgress: (progressEvent) => {
                    const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                    setUploadProgress(progress);
                },
            });

            // Handle API response
            console.log('API Response:', response.data);

            // Set upload complete state
            setUploadComplete(true);

            // Redirect to a different page after successful upload
            setTimeout(() => {
                history.push('/success');
            }, 2000); // Redirect after 2 seconds (adjust as needed)
        } catch (error) {
            console.error('Error uploading file:', error);
            // Handle error as needed
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
            <Snackbar open={showSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: '100%' }}>
                    File size should be less then {MAX_UPLOAD_FILE_SIZE / 1000000} MB
                </Alert>
            </Snackbar>
        </Container>
    )
}

export default Landing;