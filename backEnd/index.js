import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDb from './db/conn.js';
import userRouter from './routes/userRouter.js';
import directorateRouter from './routes/directorateRouter.js';
import categoryRouter from './routes/categoryRouter.js';
import specRouter from './routes/specRouter.js';
import path from 'path';
import { fileURLToPath } from 'url'; // To convert import.meta.url to a file path

dotenv.config();
const app = express();
const port = 3000;

app.use(express.json());

const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  preflightContinue: false,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

app.use(cookieParser());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, Accept");
  next();
});

// Get the directory name of the current module
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(userRouter);
app.use(directorateRouter);
app.use(categoryRouter);
app.use(specRouter);

const startServer = async () => {
  try {
    await connectDb(process.env.MONGODB_URL);
    app.listen(port, () => console.log(`Server started on port ${port}`));
  } catch (error) {
    console.error(error);
  }
};

startServer();
