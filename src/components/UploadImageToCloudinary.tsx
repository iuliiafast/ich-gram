"use client";
import { Request, Response } from 'express';
import stream from 'stream';
import cloudinary from '../back/config/cloudinaryConfig';
import getUserIdFromToken from '../back/utils/helpers';
import mongoose from 'mongoose';
import UserModel from '../back/models/userModel';
import uploadImageMiddleware from '../back/middlewares/multer';

const uploadImageToCloudinary = (file: Express.Multer.File): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!file || !file.buffer) {
      reject(new Error('Нет данных для загрузки.'));
      return;
    }

    const bufferStream = new stream.PassThrough();
    bufferStream.end(file.buffer); // файл с буфером

    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: 'image' },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result?.secure_url || '');  // Возвращаем URL изображения
        }
      }
    );

    bufferStream.pipe(uploadStream);  // Проводим поток в Cloudinary
  });
};
// Обработчик обновления профиля
export const updateUserProfile = [
  uploadImageMiddleware.single('profileImage'), // Используем middleware для загрузки
  async (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Токен не предоставлен' });
    }

    try {
      const userId = getUserIdFromToken(token);

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Некорректный формат ID пользователя' });
      }

      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'Пользователь не найден' });
      }

      const { username, bio } = req.body;

      if (username) user.username = username;
      if (bio) user.bio = bio;

      if (req.file) {
        const uploadedImageUrl = await uploadImageToCloudinary(req.file as Express.Multer.File);
        user.profile_image = uploadedImageUrl;
      }

      const updatedUser = await user.save();
      res.status(200).json(updatedUser);
    } catch (error) {
      console.error('Ошибка при обновлении профиля:', error);
      res.status(500).json({ message: 'Ошибка обновления профиля', error: error });
    }
  },
];