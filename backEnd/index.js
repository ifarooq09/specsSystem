import express from 'express'
import * as dotenv from 'dotenv'

dotenv.config
const app = express()
const port = 3000

app.get('/', (req, res) => {
    res.send({ message: 'Your backend server is running successfully'})
})

const startServer = async () => {
    try{
        app.listen(port, () => console.log(`server started on port ${port}`))
    } catch (error) {
        console.lof(error)
    }
}

startServer()