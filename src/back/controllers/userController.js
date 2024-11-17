import getIdFromToken from '../utils/helpers.js';
import stream from 'stream';
import upload from '../middlewares/multer.js';
import cloudinary from '../config/cloudinaryConfig.js';
import mongoose from 'mongoose';
import User from '../models/userModel.js';

// Получение профиля пользователя
export const getProfile = async (req, res) => {
    try {
        const userId = req.params.userId;

        // Используем стандартный метод findOne для поиска пользователя по userId
        const profile = await User.findOne({ _id: userId });

        if (!profile) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }
        res.status(200).json(profile);
    } catch (error) {
        console.error('Ошибка при получении профиля:', error);
        return res.status(500).json({ message: 'Ошибка сервера.' });
    }
};

// Обновление профиля пользователя
export const updateProfile = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Токен не предоставлен' });
    }

    try {
        // Получаем userId из токена
        const userId = getIdFromToken(token);

        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Некорректный формат ID пользователя' });
        }

        // Ищем пользователя по ID
        const profile = await User.findById(userId); // Используем метод findById для поиска по userId
        if (!profile) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        const { userName, bio } = req.body;
        if (userName) profile.userName = userName; // Обновляем userName, если он передан
        if (bio) profile.bio = bio; // Обновляем bio, если оно передано

        // Загрузка аватара, если файл был передан
        if (req.file) {
            const uploadAvatar = async () => {
                const bufferStream = new stream.PassThrough();
                bufferStream.end(req.file.buffer);

                return new Promise((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream(
                        { resource_type: 'image' },
                        (error, result) => {
                            if (error) {
                                console.error('Ошибка при загрузке изображения на Cloudinary:', error);
                                reject(error);
                            } else {
                                resolve(result?.secure_url || ''); // Возвращаем URL загруженного изображения
                            }
                        }
                    );
                    bufferStream.pipe(uploadStream); // Подаём данные изображения в Cloudinary
                });
            };

            try {
                const avatarUrl = await uploadAvatar(); // Получаем URL аватара
                profile.avatar = avatarUrl; // Обновляем аватар пользователя
            } catch (error) {
                return res.status(500).json({ message: 'Ошибка загрузки изображения', error });
            }
        }

        // Сохраняем обновлённый профиль в базе данных
        const updatedProfile = await profile.save();

        res.status(200).json({ message: 'Профиль успешно обновлен', profile: updatedProfile });
    } catch (error) {
        console.error('Ошибка при обновлении профиля:', error);
        res.status(500).json({ message: 'Ошибка обновления профиля', error });
    }
};

// Middleware для загрузки аватара с использованием multer
export const uploadAvatar = upload.single('avatar'); // Загружаем аватар с помощью multer
