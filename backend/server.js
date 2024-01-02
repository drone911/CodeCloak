const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const multer = require('multer');

const crypto = require('crypto')

const path = require('path');
const fs = require('fs');

const app = express();


const corsOptions = {
    origin: process.env.REACT_CORS_ORIGIN,
};

app.use(cors());
app.use(helmet());

app.get('/test', (req, res) => {
    res.json({ "message": "Test route works!" });
});

const storage = multer.diskStorage({
    destination: process.env.NODE_UPLOAD_DIRECTORY | '/uploads',
    filename: (req, file, cb) => {
        const hash = crypto.createHash('sha256');
        hash.update(file.originalname + file.uploadTimeStamp);
        cb(null, hash.digest('hex') + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

app.post('/api/upload', upload.single('file'), async (req, res) => {
    try {
        const { path: filePath, filename } = req.file;
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const currentTimestamp = new Date().getTime();

        const hash = crypto.createHash('sha256').update(fileContent).digest('hex');
        res.json({ filename, hash });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send("An unexpected error occured.")
});

module.exports = app;