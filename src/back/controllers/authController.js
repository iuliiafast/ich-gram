import bcrypt from 'bcrypt';
import User from '../models/userModel.js';
import generateToken from '../config/jwt.js';

// Регистрация пользователя
export const register = async (req, res) => {
  const { email, password, full_name, username } = req.body;

  try {
    // Проверка на существование пользователя с таким email или username
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Пользователь с таким email или именем уже существует' });
    }

    // Хэширование пароля
    const hashedPassword = await bcrypt.hash(password, 10);

    // Создание нового пользователя
    const user = new User({
      username,
      email,
      password: hashedPassword,
      full_name
    });

    // Сохранение нового пользователя в базе данных
    await user.save();

    // Генерация токена
    const token = generateToken(user);

    // Отправка успешного ответа с токеном и данными пользователя
    res.status(201).json({ token, user, message: 'Регистрация успешна!' });
  } catch (error) {
    console.error("Ошибка при регистрации:", error);
    res.status(500).json({ message: "Внутренняя ошибка сервера", error: error.message });
  }
};

// Логин пользователя
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Поиск пользователя по email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Неверный email или пароль' });
    }

    // Проверка пароля
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Неверный email или пароль' });
    }

    // Генерация токена
    const token = generateToken(user);

    // Отправка успешного ответа с токеном и данными пользователя
    res.status(200).json({ token, user });
  } catch (error) {
    console.error("Ошибка при логине:", error);
    res.status(500).json({ message: 'Ошибка авторизации', error: error.message });
  }
};
