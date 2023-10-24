require("dotenv").config();

const lport = process.env.LPORT || 5000;
const app = require("./server");

app.listen(lport, () => {
    console.log(`Server running on port ${lport}`);
});