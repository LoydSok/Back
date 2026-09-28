import express from 'express';

const usersRouter = express.Router();

class User {
  constructor(id, name, email) {
    this.id = id;
    this.name = name;
    this.email = email;
  }
}

const users = [
  new User(1, 'Иван', 'ivan@example.com'),
  new User(2, 'Мария', 'maria@example.com')
];

const getNextId = (items) => (items.length > 0 ? Math.max(...items.map((item) => item.id)) + 1 : 1);

usersRouter.get('/', (req, res) => {
  res.json(users);
});

// GET /users/:id — возвращает JSON с id
usersRouter.get('/:id', (req, res) => {
  res.json({ id: req.params.id });
});

usersRouter.post('/', (req, res) => {
  const { name, email } = req.body;
  const id = getNextId(users);
  const newUser = new User(id, name, email);
  users.push(newUser);
  res.status(201).json(newUser);
});

usersRouter.put('/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = users.findIndex((u) => u.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Пользователь не найден' });
  }

  const { name, email } = req.body;
  const updatedUser = new User(id, name, email);
  users[index] = updatedUser;
  res.json(updatedUser);
});

usersRouter.delete('/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = users.findIndex((u) => u.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Пользователь не найден' });
  }

  const [deletedUser] = users.splice(index, 1);
  res.json({ message: 'Пользователь успешно удален', deletedUser });
});

export default usersRouter;