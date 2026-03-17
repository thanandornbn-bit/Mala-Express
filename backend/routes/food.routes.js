import express from 'express';
import * as foodController from '../controllers/food.controller.js';
import { verifyAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', foodController.getFoods);
router.get('/:id', foodController.getFoodById);
router.post('/', verifyAdmin, foodController.createFood);
router.put('/:id', verifyAdmin, foodController.updateFood);
router.delete('/:id', verifyAdmin, foodController.deleteFood);

export default router;