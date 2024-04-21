import express from 'express'

import { createUser, login, validuser } from '../controllers/userController.js'
import authenticate from '../middleware/authenticate.js'
 
const userRouter = express.Router()

userRouter.route('/createUser').post(createUser)
userRouter.route('/login').post(login)
userRouter.route('/validuser').get(authenticate, validuser)


export default userRouter