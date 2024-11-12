import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import { loadMessages, sendMessage } from '../controllers/messageController.js';
// Проверка JWT токена для WebSocket
export const authenticateSocket = async (socket, next) => {
    var _a, _b, _c;
    // Преобразуем token к строке, если это массив
    const token = Array.isArray((_a = socket.handshake.query) === null || _a === void 0 ? void 0 : _a.token)
        ? (_b = socket.handshake.query) === null || _b === void 0 ? void 0 : _b.token[0] // Если token это массив, берем первый элемент
        : (_c = socket.handshake.query) === null || _c === void 0 ? void 0 : _c.token; // Если token строка, оставляем как есть
    if (!token) {
        return next(new Error('Доступ запрещен. Токен не предоставлен.'));
    }
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        return next(new Error('Ошибка сервера: JWT_SECRET не задан.'));
    }
    jwt.verify(token, jwtSecret, async (err, decoded) => {
        if (err) {
            return next(new Error('Ошибка аутентификации: неверный токен.'));
        }
        // Проверяем, что decoded является объектом и имеет user_id
        if (!decoded || typeof decoded === 'string' || !decoded.user_id) {
            return next(new Error('Ошибка аутентификации: неверный токен.'));
        }
        try {
            const user = await User.findById(decoded.user_id);
            if (!user) {
                return next(new Error('Ошибка аутентификации: пользователь не найден.'));
            }
            // Сохраняем пользователя в socket для дальнейшего использования
            socket.user = user;
            next();
        }
        catch (error) {
            console.error('Ошибка при валидации токена:', error);
            return next(new Error('Ошибка при валидации токена.'));
        }
    });
};
// Обработка WebSocket событий
export const messageSocketHandler = (socket, io) => {
    // Подключение пользователя к комнате
    socket.on('joinRoom', ({ targetUserId }) => {
        var _a;
        const userId = (_a = socket.user) === null || _a === void 0 ? void 0 : _a._id; // Используем userId из проверенного токена
        if (!userId)
            return;
        const roomId = [userId, targetUserId].sort().join('_');
        socket.join(roomId);
        // Загрузка истории сообщений при подключении
        loadMessages(userId, targetUserId, socket);
    });
    // Отправка сообщений
    socket.on('sendMessage', ({ targetUserId, messageText }) => {
        var _a;
        const userId = (_a = socket.user) === null || _a === void 0 ? void 0 : _a._id; // Используем userId из токена
        if (!userId)
            return;
        const roomId = [userId, targetUserId].sort().join('_');
        sendMessage(userId, targetUserId, messageText, roomId, io);
    });
    // Отключение пользователя
    socket.on('disconnect', () => {
        console.log('Пользователь отключился');
    });
};
