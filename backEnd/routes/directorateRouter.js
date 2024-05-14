import express from 'express'

import { createDirectorate } from '../controllers/directorateController.js'

const directorateRouter = express.Router()

directorateRouter.route('/createDirectorate').post(createDirectorate)

export default directorateRouter