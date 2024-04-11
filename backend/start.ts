import * as dotenv from "dotenv";

dotenv.config();

import mongoose, { Document, Schema } from 'mongoose';


import app from './server';


const lport: number = parseInt(process.env.NODE_LPORT as string, 10) || 5000;

app.listen(lport, () => {

  mongoose.connect(process.env.NODE_MONGO_URI as string);

  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'MongoDB connection error:'));
  db.once('open', () => {
    console.log('Connected to MongoDB');
  });
  console.log(`Server running on port ${lport}`);
});