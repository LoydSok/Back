import express from 'express';
import cors from 'cors';
import { sequelize } from './db.js';

import usersRouter from './routes/usersRouter.js';
import productsRouter from './routes/productsRouter.js';
import ordersRouter from './routes/ordersRouter.js';

const app = express();
const PORT = 3000;

// CORS
const allowedOrigins = ['http://localhost:5173', 'http://localhost:3000'];
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS запрещён для данного источника'));
    }
  }
};

// Rate Limiter
const requestLog = new Map();
const rateLimiter = (req, res, next) => {
  const ip = req.ip;
  const now = Date.now();
  const WINDOW_MS = 10 * 1000;
  const MAX_REQUESTS = 5;

  const timestamps = (requestLog.get(ip) || []).filter((time) => now - time < WINDOW_MS);

  if (timestamps.length >= MAX_REQUESTS) {
    return res.status(429).json({ error: 'Слишком много запросов' });
  }

  timestamps.push(now);
  requestLog.set(ip, timestamps);
  next();
};

// Logger
const logger = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
};

// Auth middleware
const authMiddleware = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ error: 'Необходим заголовок Authorization' });
  }
  next();
};

app.use(cors(corsOptions));
app.use(logger);
app.use(rateLimiter);
app.use(express.json());

app.post('/echo', (req, res) => res.json(req.body));

app.get('/admin', authMiddleware, (req, res) => {
  res.json({ message: 'Добро пожаловать в админ-панель' });
});

app.get('/search', (req, res) => {
  const { q } = req.query;
  if (!q) {
    return res.status(400).json({ error: 'Параметр "q" обязателен для поиска' });
  }
  res.json({ q });
});

app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use('/orders', ordersRouter);

// Инициализация БД и запуск сервера
const startServer = async () => {
  try {
    await sequelize.sync(); // Создаёт таблицы в SQLite, если они еще не созданы
    console.log('База данных успешно синхронизирована.');

    app.listen(PORT, () => {
      console.log(`Сервер запущен на http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Ошибка подключения к базе данных:', error);
  }
};

startServer();