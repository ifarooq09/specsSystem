import express from 'express';
import { createDirectorate, updateDirectorate, deleteDirectorate, alldirectorate, getDirectorateReport } from '../controllers/directorateController.js';
import authenticate from '../middleware/authenticate.js';
import roleBasedAccess from '../middleware/roleBasedAccess.js'

const directorateRouter = express.Router();

directorateRouter.route('/directorates').get(authenticate, alldirectorate);
directorateRouter.route('/directorates/:id').get(authenticate, getDirectorateReport);
directorateRouter.route('/directorates/addDirectorate').post(authenticate, createDirectorate);
directorateRouter.route('/directorates/:id').put(authenticate, updateDirectorate);
directorateRouter.route('/directorates/:id').delete(authenticate, roleBasedAccess(['admin']), deleteDirectorate);

export default directorateRouter;
