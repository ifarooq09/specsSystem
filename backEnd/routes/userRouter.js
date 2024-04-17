import express from 'express'

import { createUser } from '../controllers/userController.js'
 
const userRouter = express.Router()

userRouter.route('/createUser').post(createUser)



export default userRouter