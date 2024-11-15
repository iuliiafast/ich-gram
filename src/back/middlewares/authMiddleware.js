import jwt from 'jsonwebtoken';
import UserModel from '../models/userModel.js';

const authMiddleware = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', ''); // Извлекаем токен из заголовка

    if (!token) {
        return res.status(401).json({ message: 'Доступ запрещен. Токен не предоставлен.' });
    }

    try {
        const jwtSecret = process.env.JWT_SECRET;

        if (!jwtSecret) {
            throw new Error('JWT_SECRET не задан в переменных окружения.');
        }

        // Расшифровка токена
        const decoded = jwt.verify(token, jwtSecret);

        if (!decoded?.user_id) {
            return res.status(401).json({ message: 'Неверный токен: отсутствует user_id.' });
        }

        // Получение пользователя из базы данных
        const user = await UserModel.findById(decoded.user_id);

        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден.' });
        }

        req.user = user.toObject(); // Преобразуем документ в объект
        next(); // Передаем управление следующему middleware
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

module.exports = authMiddleware;
