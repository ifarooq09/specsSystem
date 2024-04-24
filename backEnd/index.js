import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import connectDb from './db/conn.js'
import userRouter from './routes/userRouter.js'

dotenv.config()
const app = express()
const port = 3000

app.use(express.json());

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true // Allow cookies to be sent with the request
  }));
  
app.use(cookieParser());

app.use(userRouter);
// app.get('/', (req, res) => {
//     res.send({ message: 'Your backend server is running successfully'})
// })

const startServer = async () => {
    try{
        connectDb(process.env.MONGODB_URL)
        app.listen(port, () => console.log(`server started on port ${port}`))
    } catch (error) {
        console.log(error)
    }
}

startServer()