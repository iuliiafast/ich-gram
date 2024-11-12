import type { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import UserModel from '../models/userModel.js';
import { DecodedToken, CustomRequest, RequestWithUser, User } from '../types.js'

// Middleware для аутентификации в Express
export const authMiddleware = async (req: CustomRequest & RequestWithUser, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');  // Извлечение токена

  if (!token) {
    return res.status(401).json({ message: 'Доступ запрещен. Токен не предоставлен.' });
  }

  try {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET не задан в переменных окружения.');
    }
    // Декодируем токен
    const decoded = jwt.verify(token, jwtSecret) as DecodedToken;
    // Проверка наличия user_id в декодированном объекте
    if (!decoded || !decoded.user_id) {
      return res.status(401).json({ message: 'Неверный токен.' });
    }
    // Проверяем пользователя в базе данных
    const user = await UserModel.findById(decoded.user_id).exec();
    if (!user) {
      return res.status(401).json({ message: 'Пользователь не найден.' });
    }
    req.user = user.toObject() as User; // Теперь req.user доступен
    next(); // Передаем управление следующему мидлвару или маршруту
  } catch (error) {
    console.error('Ошибка при валидации токена:', error);  // Логируем ошибку
    return res.status(401).json({ message: 'Неверный или истекший токен.' });
  }
};
