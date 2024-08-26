import express from 'express'

import { createUser, login, validuser, logout, alluser, updateUser, editProfile, getUserReport, getRole, viewUserCount} from '../controllers/userController.js'
import authenticate from '../middleware/authenticate.js'
import roleBasedAccess from '../middleware/roleBasedAccess.js'
 
const userRouter = express.Router()

userRouter.route('/users').get(authenticate, roleBasedAccess(['admin']), alluser)
userRouter.route('/users/count').get(authenticate, viewUserCount)
userRouter.route('/users/createUser').post(authenticate, roleBasedAccess(['admin']), createUser)
userRouter.route('/login').post(login)
userRouter.route('/validuser').get(authenticate, validuser)
userRouter.route('/users/me').get(authenticate, getRole)
userRouter.route('/logout').get(authenticate, logout)
userRouter.route('/users/:userId').put(authenticate, roleBasedAccess(['admin']), updateUser);
userRouter.route('/users/:id/report').get(authenticate, getUserReport);
userRouter.route('/editProfile').put(authenticate, editProfile)

export default userRouter