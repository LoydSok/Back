import { UsersService } from '../services/usersService.js';
import { validateUserData } from '../utils/validators.js';

export const UsersController = {
  getAll: (req, res) => {
    res.json(UsersService.getAll());
  },

  getById: (req, res) => {
    res.json({ id: req.params.id });
  },

  create: (req, res) => {
    const error = validateUserData(req.body);
    if (error) return res.status(400).json({ error });

    const newUser = UsersService.create(req.body);
    res.status(201).json(newUser);
  },

  update: (req, res) => {
    const error = validateUserData(req.body);
    if (error) return res.status(400).json({ error });

    const updatedUser = UsersService.update(Number(req.params.id), req.body);
    if (!updatedUser) return res.status(404).json({ message: 'Пользователь не найден' });

    res.json(updatedUser);
  },

  delete: (req, res) => {
    const deletedUser = UsersService.delete(Number(req.params.id));
    if (!deletedUser) return res.status(404).json({ message: 'Пользователь не найден' });

    res.json({ message: 'Пользователь успешно удален', deletedUser });
  }
};