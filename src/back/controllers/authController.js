import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';
import { generateToken } from '../config/jwt.js';

export const register = async (req, res) => {
    const { email, fullName, userName, password } = req.body;
    try {
        // Проверка на существующего пользователя с таким email или username
        const existingUser = await User.findOne({ $or: [{ email }, { userName }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Пользователь с таким email или именем уже существует' });
        }

        // Минимальная длина пароля
        if (password.length < 6) {
            return res.status(400).json({ message: 'Пароль слишком короткий. Минимум 6 символов.' });
        }

        // Хеширование пароля
        const hashedPassword = await bcrypt.hash(password, 10);

        // Создание нового пользователя
        const user = new User({
            email,
            fullName,
            userName,
            password: hashedPassword,
            avatar: '',
            postsCount: 0,
            followersCount: 0,
            followingCount: 0,
            bio: '',
            website: ''
        });

        await user.save();

        // Генерация JWT токена
        const token = generateToken(user);

        // Установка cookies с токеном и профилем (если нужно)
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 3 * 60 * 60 * 1000, // 3 часа
            sameSite: 'Strict',
        });

        const { ...userWithoutPassword } = user.toJSON();
        res.status(201).json({
            user: userWithoutPassword,
            message: 'Регистрация успешна!'
        });
    } catch (error) {
        console.error("Ошибка при регистрации:", error);
        res.status(500).json({ message: "Внутренняя ошибка сервера", error: error.message });
    }
};

export const login = async (req, res) => {
    const { email, userName, password } = req.body;

    try {
        // Если email или userName не указан, возвращаем ошибку
        if (!email && !userName) {
            return res.status(400).json({ message: 'Укажите email или username.' });
        }

        let user;
        if (email) {
            user = await User.findOne({ email });
        } else if (userName) {
            user = await User.findOne({ userName });
        }

        if (!user) {
            return res.status(400).json({ message: 'Неверный email/userName или пароль.' });
        }

        // Проверка пароля
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Неверный email/userName или пароль.' });
        }

        // Генерация JWT токена
        const token = generateToken(user);

        // Установка cookies с токеном
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 3 * 60 * 60 * 1000, // 3 часа
            sameSite: 'Strict',
        });

        // Удаляем пароль перед отправкой данных на клиент
        const { ...userWithoutPassword } = user.toJSON();

        res.status(200).json({ user: userWithoutPassword });
    } catch (error) {
        console.error("Ошибка при логине:", error);
        res.status(500).json({ message: 'Ошибка авторизации', error: error.message });
    }
};
