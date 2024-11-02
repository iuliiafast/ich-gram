// app/api/register.ts
import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from 'bcrypt';
import User from '../models/User';

export default async function registerHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { username, email, password } = req.body;

    // Убедитесь, что все поля переданы
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Все поля обязательны для заполнения.' });
    }

    try {
      // Проверка существующего пользователя
      const existingUser = await User.findOne({ $or: [{ username }, { email }] });
      if (existingUser) {
        return res.status(400).json({ message: 'Пользователь с таким именем или email уже существует.' });
      }

      // Хеширование пароля
      const hashedPassword = await bcrypt.hash(password, 10);

      // Создание нового пользователя
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
      });
      await newUser.save();

      res.status(201).json({ message: 'Пользователь зарегистрирован успешно.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Ошибка сервера при регистрации.' });
    }
  } else {
    // Обработка недопустимого метода
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Метод ${req.method} не поддерживается`);
  }
}
