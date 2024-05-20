import express from 'express';
import { createDirectorate, updateDirectorate, deleteDirectorate, alldirectorate } from '../controllers/directorateController.js';
import authenticate from '../middleware/authenticate.js';

const directorateRouter = express.Router();

directorateRouter.route('/directorates').get(authenticate, alldirectorate);
directorateRouter.route('/directorates/addDirectorate').post(authenticate, createDirectorate);
directorateRouter.route('/directorates/:id').put(authenticate, updateDirectorate);
directorateRouter.route('/directorates/:id').delete(authenticate, deleteDirectorate);

export default directorateRouter;
