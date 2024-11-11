import { Request, Response } from 'express';
import User from '../models/userModel.js';
import Post from '../models/postModel.js';

// Поиск пользователей по имени
export const searchUsers = async (req: Request, res: Response) => {
  const { query } = req.query;

  try {
    // Выполнение поиска пользователей с использованием регулярного выражения
    const users = await User.find({ username: { $regex: query, $options: 'i' } }).select('username bio');
    res.status(200).json(users);
  } catch (error) {
    console.error("Ошибка при поиске пользователей:", error); // Логирование ошибки
    res.status(500).json({ error: 'Ошибка при поиске пользователей' });
  }
};

// Поиск постов по содержимому
export const searchPosts = async (req: Request, res: Response) => {
  const { query } = req.query;

  try {
    const filter = query ? {
      $or: [
        { content: { $regex: query, $options: 'i' } },
        { caption: { $regex: query, $options: 'i' } }
      ]
    } : {}; // Если нет query, то возвращаем пустой фильтр

    // Выполнение поиска постов с использованием фильтра
    const posts = await Post.find(filter).populate('user_id', 'username');
    res.status(200).json(posts);
  } catch (error: unknown) {
    console.error("Ошибка:", error);
    res.status(500).json({ error: 'Произошла ошибка' });
  }
};
