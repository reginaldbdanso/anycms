import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import postRoutes from './routes/posts.js';
import uploadRoutes from './routes/upload.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3001'
}));

// Log requests to the console
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// Routes
app.use('/api/posts', postRoutes);
app.use('/api/upload', uploadRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});