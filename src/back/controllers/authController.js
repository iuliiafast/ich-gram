import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';
import { generateToken } from '../config/jwt.js';

export const register = async (req, res) => {
    const { email, fullName, userName, password } = req.body;
    try {
        const existingUser = await User.findOne({ $or: [{ email }, { userName }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Пользователь с таким email или именем уже существует' });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: 'Пароль слишком короткий. Минимум 6 символов.' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
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
        const token = generateToken(user);
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 3 * 60 * 60 * 1000, // 3 часа
            sameSite: 'Strict',
        });
        const { ...userWithoutPassword } = user.toJSON();
        res.status(201).json({
            user: { ...userWithoutPassword, userId: user._id },
            token,
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
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Неверный email/userName или пароль.' });
        }
        const token = generateToken(user);
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 3 * 60 * 60 * 1000, // 3 часа
            sameSite: 'Strict',
        });
        const { ...userWithoutPassword } = user.toJSON();

        res.status(200).json({
            user: { ...userWithoutPassword, userId: user._id },
            token,
            message: 'Herzlih willkommen!'
        });
    } catch (error) {
        console.error("Ошибка при логине:", error);
        res.status(500).json({ message: 'Ошибка авторизации', error: error.message });
    }
};
