import { db, User, getNextId } from '../db.js';

export const UsersService = {
  getAll: () => db.users,

  getById: (id) => db.users.find((u) => u.id === id),

  create: ({ name, email, password }) => {
    const id = getNextId(db.users);
    const newUser = new User(id, name, email, password);
    db.users.push(newUser);
    return newUser;
  },

  update: (id, { name, email, password }) => {
    const index = db.users.findIndex((u) => u.id === id);
    if (index === -1) return null;

    const updatedUser = new User(id, name, email, password);
    db.users[index] = updatedUser;
    return updatedUser;
  },

  delete: (id) => {
    const index = db.users.findIndex((u) => u.id === id);
    if (index === -1) return null;

    const [deletedUser] = db.users.splice(index, 1);
    return deletedUser;
  }
};