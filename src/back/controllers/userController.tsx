import { Request, Response } from 'express';
import getUserIdFromToken from '../utils/helpers.jsx';
import stream from 'stream';
import upload from '../middlewares/multer.js';
import cloudinary from '../config/cloudinaryConfig.js';
import mongoose from 'mongoose';
import { User, UpdateUserProfileBody, RequestWithFile } from '../types.js';
import UserModel from '../models/userModel.js';

export const getUserProfile = async (req: Request, res: Response) => {
  const userId = req.params.userId;

  // Проверка корректности ID
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: 'Некорректный формат ID пользователя' });
  }

  try {
    const user = await UserModel.findById(userId).exec();
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Ошибка при получении данных пользователя:', error);
    res.status(500).json({ message: 'Ошибка получения профиля пользователя', error });
  }
};

export const updateUserProfile = async (req: RequestWithFile, res: Response) => {
  const token = req.headers.authorization?.split(' ')[1]; // Извлекаем токен из заголовка

  if (!token) {
    return res.status(401).json({ message: 'Токен не предоставлен' });
  }

  try {
    const userId: string | null = getUserIdFromToken(token);

    // Проверка на null и валидность ID пользователя
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Некорректный формат ID пользователя' });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    const { username, bio }: UpdateUserProfileBody = req.body;

    // Обновляем поля, если они есть
    if (username) user.username = username;
    if (bio) user.bio = bio;

    // Если файл был загружен, обрабатываем изображение
    if (req.file) {
      const uploadImage = (): Promise<string> =>
        new Promise((resolve, reject) => {
          const bufferStream = new stream.PassThrough();
          bufferStream.end(req.file!.buffer);

          const uploadStream = cloudinary.uploader.upload_stream(
            { resource_type: 'image' },
            (error, result) => {
              if (error) {
                console.error('Ошибка при загрузке изображения на Cloudinary:', error);
                reject(error);
              } else {
                resolve(result?.secure_url || ''); // Возвращаем URL изображения
              }
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
    console.error('Ошибка при обновлении профиля:', error);
    res.status(500).json({ message: 'Ошибка обновления профиля' });
  }
};

export const uploadProfileImage = upload.single('profile_image');
