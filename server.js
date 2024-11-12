import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import authRoutes from './src/back/routes/authRoutes.js';
import userRoutes from './src/back/routes/userRoutes.js';
import postRoutes from './src/back/routes/postRoutes.js';
import commentRoutes from './src/back/routes/commentRoutes.js';
import searchRoutes from './src/back/routes/searchRoutes.js';
import likeRoutes from './src/back/routes/likeRoutes.js';
import followRoutes from './src/back/routes/followRoutes.js';
import notificationRoutes from './src/back/routes/notificationRoutes.js';
import { specs, swaggerUi } from './swagger.js';
import connectDB from './src/back/config/db.js';
import { messageSocketHandler, authenticateSocket } from './src/back/routes/messageRoutes.js';
import next from 'next';
import upload from './src/back/middlewares/multer.js';
import http from 'http';
import { Server } from 'socket.io';

dotenv.config();
connectDB();

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
  console.log("Next.js готов к работе");

  const app = express();
  const server = http.createServer(app);

  // Настройка CORS для Express и Socket.io
  const corsOptions = {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  };
  app.use(cors(corsOptions));

  const io = new Server(server, {
    path: '/socket.io',
    cors: {
      origin: "*", // Разрешить запросы с любого домена (можно сузить в продакшн)
      methods: ["GET", "POST"],
      allowedHeaders: ["Authorization"],
      credentials: true,  // Разрешить отправку cookies
    }
  });

  // Middleware для аутентификации Socket.io
  io.use((socket, next) => {
    authenticateSocket(socket, next);
  });

  // Обработчик подключения Socket.io
  io.on('connection', (socket) => {
    console.log('Клиент подключен:', socket.id);
    messageSocketHandler(socket, io);
  });

  // Маршрут для загрузки файлов
  app.post('/upload', upload.single('image'), async (req, res) => {
    try {
      const imageUrl = req.file.path;
      res.json({ imageUrl });
    } catch (error) {
      console.error('Ошибка при загрузке файла:', error);
      res.status(500).send('Ошибка при загрузке изображения');
    }
  });

  // Middleware и маршруты Express
  app.use(express.json());

  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(specs));
  app.use('/api/auth', authRoutes);
  app.use('/api/user', userRoutes);
  app.use('/api/post', postRoutes);
  app.use('/api/comment', commentRoutes);
  app.use('/api/search', searchRoutes);
  app.use('/api/likes', likeRoutes);
  app.use('/api/follow', followRoutes);
  app.use('/api/notifications', notificationRoutes);

  // Next.js роутинг
  app.all('*', (req, res) => {
    console.log('Обрабатывается запрос Next.js');
    return handle(req, res);
  });

  // Запуск сервера
  const port = process.env.PORT || 3000;
  server.listen(port, () => {
    console.log(`> Сервер запущен на http://localhost:${port}`);
  });
}).catch((error) => {
  console.error("Ошибка при подготовке Next.js:", error);
});
