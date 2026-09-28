import express from 'express';
import usersRouter from './routes/usersRouter.js';

class Product {
  constructor(id, title, price) {
    this.id = id;
    this.title = title;
    this.price = price;
  }
}

class Order {
  constructor(id, userId, productIds, totalPrice) {
    this.id = id;
    this.userId = userId;
    this.productIds = productIds;
    this.totalPrice = totalPrice;
  }
}

const db = {
  products: [
    new Product(1, 'Ноутбук', 50000),
    new Product(2, 'Мышь', 1500)
  ],
  orders: [
    new Order(1, 1, [1, 2], 51500)
  ]
};

const app = express();
const PORT = 3000;

app.use(express.json());

// Подключение роутера пользователей (/users)
app.use('/users', usersRouter);

// GET /search?q=... — проверка query-параметра q
app.get('/search', (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ error: 'Параметр "q" обязателен для поиска' });
  }

  res.json({ q });
});

// CRUD хелпер для остальных сущностей
const getNextId = (items) => (items.length > 0 ? Math.max(...items.map((item) => item.id)) + 1 : 1);

function createCrudRoutes(routerPath, entityArray, EntityClass) {
  app.get(routerPath, (req, res) => res.json(entityArray));

  app.get(`${routerPath}/:id`, (req, res) => {
    const id = Number(req.params.id);
    const item = entityArray.find((el) => el.id === id);
    if (!item) return res.status(404).json({ message: 'Запись не найдена' });
    res.json(item);
  });

  app.post(routerPath, (req, res) => {
    const id = getNextId(entityArray);
    const newEntity = new EntityClass(id, ...Object.values(req.body));
    entityArray.push(newEntity);
    res.status(201).json(newEntity);
  });

  app.put(`${routerPath}/:id`, (req, res) => {
    const id = Number(req.params.id);
    const index = entityArray.findIndex((el) => el.id === id);
    if (index === -1) return res.status(404).json({ message: 'Запись не найдена' });

    const updatedEntity = new EntityClass(id, ...Object.values(req.body));
    entityArray[index] = updatedEntity;
    res.json(updatedEntity);
  });

  app.delete(`${routerPath}/:id`, (req, res) => {
    const id = Number(req.params.id);
    const index = entityArray.findIndex((el) => el.id === id);
    if (index === -1) return res.status(404).json({ message: 'Запись не найдена' });

    const [deletedItem] = entityArray.splice(index, 1);
    res.json({ message: 'Успешно удалено', deletedItem });
  });
}

createCrudRoutes('/products', db.products, Product);
createCrudRoutes('/orders', db.orders, Order);

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});