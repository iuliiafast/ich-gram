import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { Types } from 'mongoose';
import React from 'React';

// Интерфейс пользователя
export interface User {
  userId: string;
  userName: string;
  avatar: string;
  postsCount: number;
  followersCount: number;
  followingCount: number;
  bio: string;
  website?: string;
}

// Интерфейс для API-ответа профиля
export interface ProfileResponse {
  userId: string;
  userName: string;
  fullName: string;
  avatar: string;
  postsCount: number;
  followersCount: number;
  followingCount: number;
  bio: string;
}

// Интерфейс для запроса с пользователем
export interface RequestWithUser extends Request {
  user?: {
    _id: string;
    userName: string;
    fullName: string;
    avatar: string;
    postsCount: number;
    followersCount: number;
    followingCount: number;
    bio: string;
  };
}

// Интерфейс для поста
export interface Post {
  userId: Types.ObjectId; // MongoDB ObjectId
  imageUrl: string;
  userName: string;
  caption: string;
  likesCount: number;
  commentsCount: number;
  createdAt: Date;
  profileImage?: string;
  postId: string;
}

// Интерфейс для ленты постов
export interface PostFeedProps {
  posts: Post[];
}

// Интерфейс для обработки ошибок
export interface ErrorResponse {
  error: string;
}

// Интерфейс для успешного ответа
export interface SuccessResponse {
  success: boolean;
  posts?: Post[];
  post?: Post;
  message?: string;
}

// Интерфейс для токена
export interface DecodedToken extends JwtPayload {
  userId: string;
}

// Интерфейс для запросов с токеном
export interface RequestWithToken extends Request {
  token?: string;
}

// Интерфейс для загрузки аватара
export type AvatarUploadProps = {
  userId: string;
  token: string;
  onAvatarChange?: (avatarUrl: string) => void;
};

// Интерфейс для обновления профиля
export interface ProfileUpdates {
  userName?: string;
  bio?: string;
  avatar?: string; // URL изображения в Cloudinary
}

// Интерфейс результата загрузки Cloudinary
export interface CloudinaryUploadResult {
  secure_url: string;  // URL загруженного изображения
  public_id: string;   // Публичный ID изображения в Cloudinary
  url: string;         // Общий URL изображения
  width: number;       // Ширина изображения
  height: number;      // Высота изображения
  format?: string;     // Формат изображения (например, 'jpg', 'png')
}

// Интерфейс состояния авторизации
export interface AuthState {
  user: User | null;   // Данные пользователя
  token: string | null; // Токен авторизации
  errorMessage: string | null; // Ошибка авторизации
  isLoading: boolean;  // Флаг загрузки
}

// Интерфейс для формы входа
export type LoginFormProps = {
  setError: React.Dispatch<React.SetStateAction<string | null>>; // Corrected this to React.Dispatch
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
};


export interface ProfileState {
  profile: User | null;
  isLoading: boolean;
  errorMessage: string | null;
}

