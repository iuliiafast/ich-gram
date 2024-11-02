import './require.js';
import express from 'express';
import cors from 'cors';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import connectDB from './src/back/config/db.js';
import authRoutes from '@back/routes/authRoutes.js';
import userRoutes from '@back/routes/userRoutes.js';
import postRoutes from '@back/routes/postRoutes.js';
import commentRoutes from '@back/routes/commentRoutes.js';
import searchRoutes from '@back/routes/searchRoutes.js';
import likeRoutes from '@back/routes/likeRoutes.js';
import followRoutes from '@back/routes/followRoutes.js';
import notificationRoutes from '@back/routes/notificationRoutes.js';
import { messageSocketHandler, authenticateSocket } from '@back/routes/messageRoutes.js';

dotenv.config();
console.log('Инициализация подключения к базе данных...');
connectDB()
  .then(() => {
    console.log('Подключение к MongoDB успешно');

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  })
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/post', postRoutes);
app.use('/api/comment', commentRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/follow', followRoutes);
app.use('/api/notifications', notificationRoutes);

const server = app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});

const io = new Server(server, {
  cors: {
    origin: '*', // Разрешить подключения с любого источника
  },
});

io.use((socket, next) => {
  authenticateSocket(socket, next); // Проверка JWT токена
});

io.on('connection', (socket) => {
  console.log('Новое WebSocket соединение');
  messageSocketHandler(socket, io); // Подключаем обработчики сообщений
});

export default app;
