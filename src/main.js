import express from 'express';
import cors from 'cors';
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

// Массив разрешённых origin
const allowedOrigins = ['http://localhost:5173', 'http://localhost:3000'];

// Настройка CORS с динамической проверкой по массиву
const corsOptions = {
  origin: (origin, callback) => {
    // !origin разрешает утилиты вроде Postman / cURL / серверные запросы без заголовка Origin
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS запрещён для данного источника'));
    }
  }
};

app.use(cors(corsOptions));

// Хранилище запросов для rate limiter: Map<ip, Array<timestamp>>
const requestLog = new Map();

// Middleware для ограничения количества запросов (Rate Limiter)
const rateLimiter = (req, res, next) => {
  const ip = req.ip;
  const now = Date.now();
  const WINDOW_MS = 10 * 1000; // 10 секунд
  const MAX_REQUESTS = 5;

  const timestamps = requestLog.get(ip) || [];

  // Оставляем только метки времени за последние 10 секунд
  const recentTimestamps = timestamps.filter((time) => now - time < WINDOW_MS);

  if (recentTimestamps.length >= MAX_REQUESTS) {
    return res.status(429).json({ error: 'Слишком много запросов' });
  }

  // Добавляем текущий запрос и обновляем Map
  recentTimestamps.push(now);
  requestLog.set(ip, recentTimestamps);

  next();
};

// Кастомный middleware-логгер
const logger = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
};

// Глобальные middleware
app.use(logger);
app.use(rateLimiter);
app.use(express.json());

// Middleware авторизации для локальной защиты конкретного маршрута
const authMiddleware = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ error: 'Необходим заголовок Authorization' });
  }
  next();
};

// POST /echo — возвращает переданное JSON-тело
app.post('/echo', (req, res) => {
  res.json(req.body);
});

// GET /admin — доступен только при наличии заголовка Authorization
app.get('/admin', authMiddleware, (req, res) => {
  res.json({ message: 'Добро пожаловать в админ-панель' });
});

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