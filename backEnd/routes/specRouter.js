import express from 'express'

import { createSpec, allSpecifications, getSpecs } from '../controllers/specController.js'
import authenticate from '../middleware/authenticate.js'

const specRouter = express.Router();

specRouter.route('/specifications').get(authenticate, allSpecifications)
specRouter.route('/specifications/addSpecification').post(authenticate, createSpec);
specRouter.route('/specifications/:id').get(authenticate, getSpecs )

export default specRouter;