import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const authMiddleware = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ message: 'Доступ запрещен. Токен не предоставлен.' });
    }

    try {
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Error('JWT_SECRET не задан в переменных окружения.');
        }
        const decoded = jwt.verify(token, jwtSecret);
        if (!decoded?.userId) {
            return res.status(401).json({ message: 'Неверный токен: отсутствует user_id.' });
        }
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден.' });
        }

        req.user = user.toObject();
        next();

    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ message: 'Токен истек. Пожалуйста, авторизуйтесь заново.' });
        } else if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ message: 'Неверный токен.' });
        }
        console.error('Ошибка при обработке токена:', error);
        return res.status(500).json({ message: 'Ошибка на сервере при валидации токена.' });
    }
};

export { authMiddleware };

export const authenticateSocket = async (socket, next) => {
    // Извлекаем токен из запроса
    const token = socket.handshake.query.token || socket.handshake.headers['authorization']?.split(' ')[1];

    // Если токен не найден
    if (!token) {
        return next(new Error('Доступ запрещен. Токен не предоставлен.'));
    }

    // Получаем секретный ключ из переменных окружения
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        return next(new Error('Ошибка сервера: JWT_SECRET не задан.'));
    }

    // Проверка и декодирование токена
    jwt.verify(token, jwtSecret, async (err, decoded) => {
        if (err) {
            return next(new Error('Ошибка аутентификации: неверный токен.'));
        }

        if (!decoded || typeof decoded === 'string' || !decoded.userId) {
            return next(new Error('Ошибка аутентификации: неверный токен.'));
        }

        try {
            // Находим пользователя по decoded.userId
            const user = await User.findById(decoded.userId);
            if (!user) {
                return next(new Error('Ошибка аутентификации: пользователь не найден.'));
            }

            // Добавляем информацию о пользователе в сокет
            socket.user = user;
            next(); // Разрешаем подключение
        } catch (error) {
            console.error('Ошибка при валидации токена:', error);
            return next(new Error('Ошибка при валидации токена.'));
        }
    });
};
