require("dotenv").config();

const lport = process.env.NODE_LPORT || 5000;
const app = require("./server");


app.listen(lport, () => {
    console.log(`Server running on port ${lport}`);
});