import { UsersService } from '../services/usersService.js';
import { validateUserData } from '../utils/validators.js';

export const UsersController = {
  getAll: async (req, res) => {
    const users = await UsersService.getAll();
    res.json(users);
  },

  getById: (req, res) => {
    res.json({ id: req.params.id });
  },

  create: async (req, res) => {
    const error = validateUserData(req.body);
    if (error) return res.status(400).json({ error });

    try {
      const newUser = await UsersService.create(req.body);
      res.status(201).json(newUser);
    } catch (err) {
      if (err.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({ error: 'Пользователь с таким email уже существует' });
      }
      res.status(500).json({ error: 'Ошибка сервера' });
    }
  },

  update: async (req, res) => {
    const error = validateUserData(req.body, true);
    if (error) return res.status(400).json({ error });

    try {
      const updatedUser = await UsersService.update(Number(req.params.id), req.body);
      if (!updatedUser) return res.status(404).json({ message: 'Пользователь не найден' });
      res.json(updatedUser);
    } catch (err) {
      if (err.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({ error: 'Пользователь с таким email уже существует' });
      }
      res.status(500).json({ error: 'Ошибка сервера' });
    }
  },

  delete: async (req, res) => {
    const deletedUser = await UsersService.delete(Number(req.params.id));
    if (!deletedUser) return res.status(404).json({ message: 'Пользователь не найден' });

    res.json({ message: 'Пользователь успешно удален', deletedUser });
  }
};