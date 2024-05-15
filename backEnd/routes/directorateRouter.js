import express from 'express'

import { createDirectorate } from '../controllers/directorateController.js'
import authenticate from '../middleware/authenticate.js'

const directorateRouter = express.Router()

directorateRouter.route('/directorates/addDirectorate').post(authenticate, createDirectorate)

export default directorateRouter