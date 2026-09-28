import express from 'express';


// 1. КЛАССЫ СУЩНОСТЕЙ (Domain Models)


class User {
  constructor(id, name, email) {
    this.id = id;
    this.name = name;
    this.email = email;
  }
}

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
    this.productIds = productIds; // массив ID товаров
    this.totalPrice = totalPrice;
  }
}


// 2. ИМИТАЦИЯ БАЗЫ ДАННЫХ (In-Memory DB)


const db = {
  users: [
    new User(1, 'Иван', 'ivan@example.com'),
    new User(2, 'Мария', 'maria@example.com')
  ],
  products: [
    new Product(1, 'Ноутбук', 50000),
    new Product(2, 'Мышь', 1500)
  ],
  orders: [
    new Order(1, 1, [1, 2], 51500)
  ]
};

// 3. НАСТРОЙКА EXPRESS И ВСПОМОГАТЕЛЬНЫХ ФУНКЦИЙ

const app = express();
const PORT = 3000;

// Middleware для чтения JSON в body запросов
app.use(express.json());

// Универсальный генератор автоинкремента ID
const getNextId = (items) => (items.length > 0 ? Math.max(...items.map((item) => item.id)) + 1 : 1);

// Универсальная хелпер-функция для генерации CRUD-эндпоинтов
function createCrudRoutes(routerPath, entityArray, EntityClass) {
  // CREATE (C)
  app.post(routerPath, (req, res) => {
    const id = getNextId(entityArray);
    const newEntity = new EntityClass(id, ...Object.values(req.body));
    entityArray.push(newEntity);
    res.status(201).json(newEntity);
  });

  // READ ALL (R)
  app.get(routerPath, (req, res) => {
    res.json(entityArray);
  });

  // READ ONE BY ID (R)
  app.get(`${routerPath}/:id`, (req, res) => {
    const id = Number(req.params.id);
    const item = entityArray.find((el) => el.id === id);

    if (!item) {
      return res.status(404).json({ message: 'Запись не найдена' });
    }
    res.json(item);
  });

  // UPDATE (U)
  app.put(`${routerPath}/:id`, (req, res) => {
    const id = Number(req.params.id);
    const index = entityArray.findIndex((el) => el.id === id);

    if (index === -1) {
      return res.status(404).json({ message: 'Запись не найдена' });
    }

    const updatedEntity = new EntityClass(id, ...Object.values(req.body));
    entityArray[index] = updatedEntity;
    res.json(updatedEntity);
  });

  // DELETE (D)
  app.delete(`${routerPath}/:id`, (req, res) => {
    const id = Number(req.params.id);
    const index = entityArray.findIndex((el) => el.id === id);

    if (index === -1) {
      return res.status(404).json({ message: 'Запись не найдена' });
    }

    const [deletedItem] = entityArray.splice(index, 1);
    res.json({ message: 'Успешно удалено', deletedItem });
  });
}


// 4. РЕГИСТРАЦИЯ ЭНДПОИНТОВ ДЛЯ СУЩНОСТЕЙ


createCrudRoutes('/api/users', db.users, User);
createCrudRoutes('/api/products', db.products, Product);
createCrudRoutes('/api/orders', db.orders, Order);


// 5. ЗАПУСК СЕРВЕРА


app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});