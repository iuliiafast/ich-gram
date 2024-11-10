import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

export const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Доступ запрещен. Токен не предоставлен.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Обновите здесь проверку токена на допустимость пользователя
    const user = await User.findById(decoded.user_id);
    if (!user) {
      return res.status(401).json({ message: 'Пользователь не найден.' });
    }

    req.user = user; // Сохраняем данные пользователя для дальнейшего использования
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Неверный или истекший токен.' });
  }
};
// Middleware для аутентификации WebSocket
export const authenticateSocket = (socket, next) => {
  const token = socket.handshake.query?.token; // Получаем токен из запроса WebSocket

  if (!token) {
    return next(new Error('Ошибка аутентификации: токен не предоставлен.'));
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return next(new Error('Ошибка аутентификации: неверный токен.'));
    }

    try {
      const user = await User.findById(decoded.user_id);
      if (!user) {
        return next(new Error('Ошибка аутентификации: пользователь не найден.'));
      }

      socket.user = user; // Сохраняем данные пользователя в сокете для дальнейшего использования
      next();
    } catch (error) {
      return next(new Error('Ошибка сервера при аутентификации пользователя.'));
    }
  });

};
// messageHandler.js
export const messageSocketHandler = (socket, io) => {
  // Обработчик для сообщений от клиента
  socket.on('send_message', (data) => {
    console.log('Получено сообщение от клиента:', data);

    // Дополнительная логика обработки сообщений
    // Например, отправить это сообщение другим пользователям
    io.emit('receive_message', { user: socket.user.username, message: data });
  });

  // Обработчик для события отключения клиента
  socket.on('disconnect', () => {
    console.log('Клиент отключен:', socket.id);
  });
};

