import express from 'express'

import { createUser, login, validuser, logout, alluser, updateUser, editProfile, getUserReport} from '../controllers/userController.js'
import authenticate from '../middleware/authenticate.js'
 
const userRouter = express.Router()

userRouter.route('/users').get(authenticate, alluser)
userRouter.route('/users/createUser').post(authenticate, createUser)
userRouter.route('/login').post(login)
userRouter.route('/validuser').get(authenticate, validuser)
userRouter.route('/logout').get(authenticate, logout)
userRouter.route('/users/:userId').put(authenticate, updateUser);
userRouter.route('/users/:id/report').get(authenticate, getUserReport);
userRouter.route('/editProfile').put(authenticate, editProfile)

export default userRouter