import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'

import connectDb from './db/conn.js'

dotenv.config()
const app = express()
const port = 3000

app.get('/', (req, res) => {
    res.send({ message: 'Your backend server is running successfully'})
})

const startServer = async () => {
    try{
        connectDb(process.env.MONGODB_URL)
        app.listen(port, () => console.log(`server started on port ${port}`))
    } catch (error) {
        console.log(error)
    }
}

startServer()