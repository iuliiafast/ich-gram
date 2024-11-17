import { Request, Response } from 'express';
import mongoose from 'mongoose';
import cloudinary from 'cloudinary';
import UserModel from '../back/models/userModel';
import { getIdFromToken } from '../back/config/jwt';
import upload from '../back/middlewares/multer';

// Интерфейс для обновлений профиля пользователя
interface ProfileUpdates {
  userName?: string;
  bio?: string;
  avatar?: string; // URL изображения в Cloudinary
}

// Интерфейс для результата загрузки на Cloudinary
interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  url: string;
}

// Функция для загрузки изображения в Cloudinary
const uploadImageToCloudinary = (req: Request): Promise<CloudinaryUploadResult> => {
  return new Promise<CloudinaryUploadResult>((resolve, reject) => {
    if (!req.file) {
      // Если файл не был передан, отклоняем промис с ошибкой
      return reject(new Error('Файл не найден'));
    }
    cloudinary.v2.uploader.upload_stream(
      { resource_type: 'image' },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result as CloudinaryUploadResult);
        }
      }
    ).end(req.file.buffer);
  });
};

// Маршрут для обновления профиля пользователя
export const updateProfile = [
  upload.single('avatar'), // Обработчик загрузки одного файла с именем 'avatar'
  async (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(' ')[1]; // Извлекаем токен из заголовков

    // Проверка на наличие токена
    if (!token) {
      return res.status(401).json({ message: 'Токен не предоставлен' });
    }

    try {
      const userId = getIdFromToken(token); // Извлекаем userId из токена

      // Проверка, является ли userId валидным ObjectId
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Некорректный формат ID пользователя' });
      }

      const user = await UserModel.findById(userId); // Находим пользователя в базе данных
      if (!user) {
        return res.status(404).json({ message: 'Пользователь не найден' });
      }

      const { userName, bio } = req.body;

      // Проверка, есть ли данные для обновления
      if (!userName && !bio && !req.file) {
        return res.status(400).json({ message: 'Нет изменений для обновления' });
      }

      // Объект для обновлений
      const updates: ProfileUpdates = {};

      // Если в теле запроса есть username или bio, добавляем их в обновления
      if (userName) updates.userName = userName;
      if (bio) updates.bio = bio;

      // Если есть файл (изображение), загружаем его в Cloudinary и добавляем URL в обновления
      if (req.file) {
        try {
          // Используем функцию для загрузки изображения
          const uploadResult = await uploadImageToCloudinary(req);

          // Добавляем URL изображения в объект обновлений
          updates.avatar = uploadResult.secure_url;

        } catch (uploadError) {
          return res.status(500).json({
            message: 'Ошибка загрузки изображения на сервер',
            error: uploadError.message,
          });
        }
      }

      // Применяем обновления к найденному пользователю
      Object.assign(user, updates);
      const updatedUser = await user.save(); // Сохраняем обновленного пользователя

      // Отправляем обновленные данные пользователю
      res.status(200).json(updatedUser);
    } catch (error) {
      // Логируем и отправляем ошибку в случае исключения
      console.error('Ошибка при обновлении профиля:', error);
      res.status(500).json({ message: 'Ошибка обновления профиля', error: error.message });
    }
  }
]
