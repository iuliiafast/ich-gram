import { Types, Document } from 'mongoose';
import { Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import User from '../back/models/userModel';
// Интерфейс для профиля пользователя
export interface UserProfile {
  _id: string;
  full_name: string;
  username: string;
  avatar: string;
  followers_count: number;
  following_count: number;
  posts_count: number;
}

// Интерфейс для ответа профиля
export interface UserProfileResponse {
  user_id: string;
  username: string;
  full_name: string;
  posts_count: number;
  followers_count: number;
  following_count: number;
  avatar: string;
}

// Интерфейс для запроса с пользователем
export interface RequestWithUser extends Request {
  user?: {
    _id: string;
    username: string;
    full_name: string;
    posts_count: number;
    followers_count: number;
    following_count: number;
    avatar: string;
  };
}

// Получение профиля пользователя
export const getUserProfile = async (req: RequestWithUser, res: Response<UserProfileResponse | { message: string }>) => {
  try {
    const user = req.user;  // Получаем пользователя из объекта запроса
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден.' });
    }

    // Формируем данные профиля
    const userProfile: UserProfileResponse = {
      user_id: user._id,
      username: user.username,
      full_name: user.full_name,
      posts_count: user.posts_count,
      followers_count: user.followers_count,
      following_count: user.following_count,
      avatar: user.avatar,
    };

    res.status(200).json(userProfile);  // Отправляем данные профиля в ответ
  } catch (error) {
    console.error('Ошибка при получении профиля:', error);
    return res.status(500).json({ message: 'Ошибка сервера.' });
  }
};

// Интерфейс для поста
export interface Post {
  user_id: Types.ObjectId;
  image_url: string;
  user_name: string;
  caption: string;
  likes_count: number;
  comments_count: number;
  created_at: Date;
  profile_image?: string;
}

// Интерфейс для ошибки
export interface ErrorResponse {
  error: string;  // Ошибка в случае неудачного запроса
}

// Интерфейс для успешного ответа (список постов)
export interface SuccessResponse {
  success: boolean; // Успешный ответ
  posts?: Post[];   // Массив постов в случае успешного запроса
  post?: Post;      // Один пост, если запрос касается одного поста
  message?: string; // Сообщение (по желанию)
}

// Интерфейс для запроса с файлом
export interface RequestWithFile extends Request {
  file: Express.Multer.File;  // Добавляем свойство `file` для работы с загрузкой файлов
}

// Интерфейс для обновления профиля пользователя
export interface UpdateUserProfileBody {
  username?: string;
  bio?: string;
  profile_image?: Express.Multer.File;  // Если потребуется обновить изображение профиля, можно добавить сюда
}
// Типизация декодированного объекта
export interface DecodedToken extends JwtPayload {
  user_id: string;  // user_id должен быть строкой
}
export interface CustomRequest extends Request {
  user?: User; // Здесь укажите тип User, который вы используете
}
export interface User extends Document {
  _id: string; // или Types.ObjectId
  username: string;
  profile_image?: string | null;
  email: string;
  password: string;
  full_name: string;
  bio: string;
  followers_count: number;
  following_count: number;
  posts_count: number;
  avatar: string;
  created_at: Date;
}
export interface RequestWithToken extends Request {
  token?: string;  // Токен может быть в заголовке или в теле запроса
}