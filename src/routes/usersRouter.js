import express from 'express';
import { UsersController } from '../controllers/usersController.js';

const usersRouter = express.Router();

usersRouter.get('/', UsersController.getAll);
usersRouter.get('/:id', UsersController.getById);
usersRouter.post('/', UsersController.create);
usersRouter.put('/:id', UsersController.update);
usersRouter.delete('/:id', UsersController.delete);

export default usersRouter;