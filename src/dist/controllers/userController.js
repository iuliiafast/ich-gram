import getUserIdFromToken from '../utils/helpers.js';
import stream from 'stream';
import upload from '../middlewares/multer.js';
import cloudinary from '../config/cloudinaryConfig.js';
import mongoose from 'mongoose';
import UserModel from '../models/userModel.js';
export const getUserProfile = async (req, res) => {
    const userId = req.params.userId;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Некорректный формат ID пользователя' });
    }
    try {
        const user = await UserModel.findById(userId).exec();
        if (!user) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }
        res.status(200).json(user);
    }
    catch (error) {
        console.error('Ошибка при получении данных пользователя:', error);
        res.status(500).json({ message: 'Ошибка получения профиля пользователя', error });
    }
};
export const updateUserProfile = async (req, res) => {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Токен не предоставлен' });
    }
    try {
        const userId = getUserIdFromToken(token);

        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Некорректный формат ID пользователя' });
        }
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }
        const { username, bio } = req.body;
        // Обновляем поля, если они есть
        if (username)
            user.username = username;
        if (bio)
            user.bio = bio;
        // Если файл был загружен, обрабатываем изображение
        if (req.file) {
            const uploadImage = () => new Promise((resolve, reject) => {
                const bufferStream = new stream.PassThrough();
                bufferStream.end(req.file.buffer);
                const uploadStream = cloudinary.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
                    if (error) {
                        console.error('Ошибка при загрузке изображения на Cloudinary:', error);
                        reject(error);
                    }
                    else {
                        resolve((result === null || result === void 0 ? void 0 : result.secure_url) || '');
                    }
                });
                bufferStream.pipe(uploadStream);
            });

            user.profile_image = await uploadImage();
        }
        const updatedUser = await user.save();
        res.status(200).json(updatedUser);
    }
    catch (error) {
        console.error('Ошибка при обновлении профиля:', error);
        res.status(500).json({ message: 'Ошибка обновления профиля' });
    }
};
export const uploadProfileImage = upload.single('profile_image');
