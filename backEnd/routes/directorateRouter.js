import express from 'express'

import { createDirectorate,alldirectorate } from '../controllers/directorateController.js'
import authenticate from '../middleware/authenticate.js'

const directorateRouter = express.Router()

directorateRouter.route('/directorates').get(authenticate, alldirectorate )
directorateRouter.route('/directorates/addDirectorate').post(authenticate, createDirectorate)

export default directorateRouter