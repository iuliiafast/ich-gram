import User from '../models/userModel.js';
import getUserIdFromToken from '../utils/helpers.js';
import stream from 'stream';
import upload from '../middlewares/multer.js';
import cloudinary from '../../../cloudinaryConfig.js';
import mongoose from 'mongoose';

export const getUserProfile = async (req, res) => {
  const userId = req.params.userId;

  // Проверка наличия userId в запросе
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: 'Некорректный формат ID пользователя' });
  }
  try {
    const user = await User.findById(userId).select('-password -created_at');
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Ошибка при получении данных пользователя:', error.stack);
    res.status(500).json({ message: 'Ошибка получения профиля пользователя', error: error.message });
  }
};

// Обновить профиль пользователя
export const updateUserProfile = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]; // Извлекаем токен из заголовка

  if (!token) {
    return res.status(401).json({ message: 'Токен не предоставлен' });
  }

  try {
    const userId = getUserIdFromToken(token);

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Некорректный формат ID пользователя' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    const { username, bio } = req.body;
    if (username) user.username = username;
    if (bio) user.bio = bio;

    // Проверяем, был ли загружен файл
    if (req.file) {
      // Обрабатываем загрузку изображения через Cloudinary
      const uploadImage = () =>
        new Promise((resolve, reject) => {
          const bufferStream = new stream.PassThrough();
          bufferStream.end(req.file.buffer);

          const uploadStream = cloudinary.uploader.upload_stream(
            { resource_type: 'image' },
            (error, result) => {
              if (error) return reject(error);
              resolve(result.secure_url); // возвращаем URL изображения
            }
          );

          bufferStream.pipe(uploadStream);
        });

      // Загружаем изображение и обновляем профиль
      user.profile_image = await uploadImage();
    }

    const updatedUser = await user.save();
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Ошибка при обновлении профиля:', error.stack);
    res.status(500).json({ message: 'Ошибка обновления профиля', error: error.message });
  }
};

// Экспорт загрузки
export const uploadProfileImage = upload.single('profile_image');
