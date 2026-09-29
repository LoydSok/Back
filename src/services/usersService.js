import bcrypt from 'bcrypt';
import { User } from '../db.js';

const SALT_ROUNDS = 10;

export const UsersService = {
  getAll: async () => {
    return await User.findAll({ attributes: { exclude: ['password'] } });
  },

  getById: async (id) => {
    return await User.findByPk(id, { attributes: { exclude: ['password'] } });
  },

  create: async ({ name, email, password }) => {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await User.create({ name, email, password: hashedPassword });
    
    const userJson = user.toJSON();
    delete userJson.password;
    return userJson;
  },

  update: async (id, { name, email, password }) => {
    const user = await User.findByPk(id);
    if (!user) return null;

    const updateData = { name, email };
    if (password) {
      updateData.password = await bcrypt.hash(password, SALT_ROUNDS);
    }

    await user.update(updateData);
    
    const userJson = user.toJSON();
    delete userJson.password;
    return userJson;
  },

  delete: async (id) => {
    const user = await User.findByPk(id);
    if (!user) return null;

    await user.destroy();
    
    const userJson = user.toJSON();
    delete userJson.password;
    return userJson;
  }
};