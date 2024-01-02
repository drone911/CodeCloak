import * as dotenv from "dotenv";
dotenv.config({ path: __dirname+'/.env' });

import app from './server';

dotenv.config();

const lport: number = parseInt(process.env.NODE_LPORT as string, 10) || 5000;

app.listen(lport, () => {
  console.log(`Server running on port ${lport}`);
});