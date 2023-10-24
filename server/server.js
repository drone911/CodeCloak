const cors = require('cors');
const express = require('express');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/test', (req, res) => {
    res.json({"message": "Test route works!"});
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send("An unexpected error occured.")
});

module.exports = app;