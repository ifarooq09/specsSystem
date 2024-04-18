import express from 'express'

import { createUser, login } from '../controllers/userController.js'
 
const userRouter = express.Router()

userRouter.route('/createUser').post(createUser)
userRouter.route('/login').post(login)


export default userRouter