import React, { useState } from 'react';
import axios from 'axios'
import numeral from 'numeral';

import { useLoaderData, useNavigate, Await, defer, useOutletContext } from 'react-router-dom';
import { useDispatch } from 'react-redux'


import RecentFiles from './components/recent-files';
import MyUploads from './components/my-uploads';

import { appendValue } from '../reducers/uploadedFilesSlice';

import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Box from '@mui/material/Box';


import LinearProgress from '@mui/material/LinearProgress';
import useMediaQuery from '@mui/material/useMediaQuery';
import Skeleton from '@mui/material/Skeleton';


import { Snackbar, Alert, Paper, Stack, useTheme} from '@mui/material';


const landingLoader = async () => {
    return defer({
        db_file_count: axios.get(`${process.env.REACT_APP_API_URL}/file/count`)
    })
}
function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box padding={0}>
                    {children}
                </Box >
            )}
        </div>
    );
}


function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}


export { landingLoader };

const Landing = () => {
    const [darkMode] = useOutletContext();
    const [showFileSizeErrorSnackbar, setShowFileSizeErrorSnackbar] = useState(false);
    const [showFileUploadErrorSnackbar, setShowFileUploadErrorSnackbar] = useState(false);
    const isSmallScreen = useMediaQuery(useTheme().breakpoints.down('sm'));
    
    const navigate = useNavigate();
    const dataFromLoader = useLoaderData();


    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadComplete, setUploadComplete] = useState(false);
    const [value, setValue] = React.useState(0);
    const dispatch = useDispatch();

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

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
            dispatch(appendValue(response.data["hash"]));

            setTimeout(() => {
                if(response.data.exists) {
                    navigate(`detect/${response.data["hash"]}`)
                } else{
                    navigate(`scan/${response.data["hash"]}`)
                }
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
                    <Typography variant={isSmallScreen ? 'h2' : 'h1'} sx={{ fontWeight: '400' }}>Detect</Typography>
                    <Typography variant={isSmallScreen ? 'h2' : 'h1'} sx={{ fontWeight: '400' }} color='secondary'>Code Signatures</Typography>
                    <Typography variant={isSmallScreen ? 'h2' : 'h1'} sx={{ fontWeight: '400' }}>Caught by</Typography>
                    <Typography variant={isSmallScreen ? 'h2' : 'h1'} sx={{ fontWeight: '400' }} color='secondary'>Antivirus</Typography>
                </Grid>
                <Grid container xs={12} md={6} sx={{ display: "flex", "alignItems": "center" }}>
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
                    <Grid container xs={12} md={12}>
                        <Grid item xs={12} md={8}>
                            <Paper sx={{ px: isSmallScreen ? 2 : 3, py: isSmallScreen ? 2 : 2, mx: isSmallScreen ? 2 : 0 }} elevation={3}>
                                <Typography variant="body1" color="primary">
                                    Upload Pen-Testing Code or Binary
                                </Typography>
                                <form onSubmit={handleFileUpload}>
                                    <Stack spacing={2}>
                                        <Grid container spacing={1} alignItems="center">
                                            <Grid item xs={6}>
                                                <input type="file" id="file-upload" onChange={onFileChange} style={{ display: 'none', zIndex: 1 }} />
                                                <Button variant="contained" sx={{ flexWrap: "nowrap", display: "flex", alignItems: "center" }} onClick={onSelectFileClicked} htmlFor="file-upload">
                                                    <LibraryAddIcon sx={{ marginRight: 1 }} />
                                                    <Typography variant="body2" sx={{ cursor: 'pointer', zIndex: 2, position: 'relative' }}>
                                                        Select File
                                                    </Typography>
                                                </Button>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <div style={{ zIndex: 2, position: 'relative' }}>
                                                    <Typography variant="body1" sx={{ cursor: 'pointer', marginRight: 1 }}>
                                                        {selectedFile ? selectedFile.name : 'No file chosen'}
                                                    </Typography>
                                                </div>
                                            </Grid>
                                        </Grid>
                                        {selectedFile && (
                                            <div>
                                                <LinearProgress sx={{ transition: 'transform 2s' }} variant="determinate" value={uploadProgress} />
                                            </div>
                                        )}
                                        <Button type="submit" disabled={selectedFile === null ? true : false} variant="outlined">
                                            <CloudUploadIcon sx={{ marginRight: 1 }} />
                                            <Typography variant="body1" sx={{ cursor: 'pointer', marginRight: 1 }}>
                                                Upload
                                            </Typography>
                                        </Button>

                                    </Stack>

                                </form>
                            </Paper>

                        </Grid>
                        <Grid item xs={12} md={4} display="flex" justifyContent="center">
                            <Paper sx={{ px: 3, py: 2 }} elevation={3}>
                                <Typography variant="body1" color="primary">
                                    Signatures detected in
                                </Typography>
                                <React.Suspense
                                    fallback={
                                        <Typography variant="h4">
                                            <Skeleton />
                                        </Typography>}
                                >
                                    <Await
                                        resolve={dataFromLoader.db_file_count}
                                        errorElement={
                                            <Typography variant="body1" color="error">
                                                Error loading count of files!
                                            </Typography>
                                        }
                                    >
                                        {(db_file_count) => (
                                            <Grid container display="flex" alignItems="flex-end">
                                                <Grid item xs={6}>
                                                    <Typography variant="h3" p={0}>
                                                        {numeral(db_file_count.data.count).format('0a')}
                                                    </Typography> </Grid>
                                                <Grid item>
                                                    <Typography variant="body1" pb={0.5}>
                                                        files
                                                    </Typography>
                                                </Grid>
                                            </Grid>

                                        )}
                                    </Await>
                                </React.Suspense>

                            </Paper>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <Paper elevation={3} >
                            <Tabs value={value} onChange={handleChange} textColor="primary"
                                indicatorColor="primary" aria-label="basic tabs example">
                                <Tab label="Recent Uploads" {...a11yProps(0)} />
                                <Tab label="My Uploads" {...a11yProps(1)} />
                            </Tabs>
                            <CustomTabPanel value={value} index={0}>
                                <RecentFiles />
                            </CustomTabPanel>
                            <CustomTabPanel value={value} index={1}>
                                <MyUploads />
                            </CustomTabPanel>
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

        </Container >
    )
}

export default Landing;