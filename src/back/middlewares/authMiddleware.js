import jwt from 'jsonwebtoken';
import UserModel from '../models/userModel.js';

export const authMiddleware = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', ''); // Извлекаем токен

    if (!token) {
        return res.status(401).json({ message: 'Доступ запрещен. Токен не предоставлен.' });
    }

    try {
        const jwtSecret = process.env.JWT_SECRET;

        if (!jwtSecret) {
            throw new Error('JWT_SECRET не задан в переменных окружения.');
        }
        const decoded = jwt.verify(token, jwtSecret);
        if (!decoded || !decoded.user_id) {
            return res.status(401).json({ message: 'Неверный токен: отсутствует user_id.' });
        }
        const user = await UserModel.findById(decoded.user_id).exec();
        if (!user) {
            return res.status(401).json({ message: 'Пользователь не найден.' });
        }

        req.user = user.toObject();
        next();

    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ message: 'Токен истек. Пожалуйста, авторизуйтесь заново.' });
        } else if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ message: 'Неверный токен.' });
        }
        return res.status(500).json({ message: 'Ошибка на сервере при валидации токена.' });
    }
};
