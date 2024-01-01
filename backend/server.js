const cors = require('cors');
const express = require('express');

const app = express();

app.use(helmet());
app.use(cors());

app.get('/test', (req, res) => {
    res.json({ "message": "Test route works!" });
});

const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        const hash = crypto.createHash('sha256');
        hash.update(file.originalname + Date.now());
        cb(null, hash.digest('hex') + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

app.post('/api/upload', upload.single('file'), async (req, res) => {
    try {
        const { path: filePath, filename } = req.file;
        const fileContent = await fs.readFile(filePath, 'utf-8');
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