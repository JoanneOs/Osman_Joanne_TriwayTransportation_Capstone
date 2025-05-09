import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import connectDB from './config/db.js';
import truckRoutes from './routes/truckRoutes.js'; // <-- Add this line

const app = express();
const port = process.env.PORT || 5000;

connectDB();
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
  res.send('Hello, Triway Transportation API!');
});

// Mount your truck API routes
app.use('/api/trucks', truckRoutes); // <-- Add this line

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
