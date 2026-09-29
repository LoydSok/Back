import express from 'express';
import { OrdersController } from '../controllers/ordersController.js';

const ordersRouter = express.Router();

ordersRouter.get('/', OrdersController.getAll);
ordersRouter.get('/:id', OrdersController.getById);
ordersRouter.post('/', OrdersController.create);
ordersRouter.put('/:id', OrdersController.update);
ordersRouter.delete('/:id', OrdersController.delete);

export default ordersRouter;