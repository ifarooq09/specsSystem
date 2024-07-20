import express from 'express';
import { createCategory, allCategories, updateCategory, deleteCategory, getCategoryReport } from '../controllers/categoryController.js';
import authenticate from '../middleware/authenticate.js';

const categoryRouter = express.Router();

categoryRouter.route('/categories').get(authenticate, allCategories);
categoryRouter.route('/categories/:id').get(authenticate, getCategoryReport)
categoryRouter.route('/categories/addCategory').post(authenticate, createCategory);
categoryRouter.route('/categories/:id').put(authenticate, updateCategory);
categoryRouter.route('/categories/:id').delete(authenticate, deleteCategory)

export default categoryRouter;