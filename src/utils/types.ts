import mongoose, { Types, Document } from 'mongoose';
import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { ThunkAction } from "redux-thunk";
import { RootState } from "../utils/store/index";

// Определяем тип для асинхронного действия
export type AppDispatch = ThunkDispatch<RootState, unknown, any>;
export type AsyncThunkAction = ThunkAction<Promise<void>, RootState, unknown, Action<string>>;

export interface UserObject {
  email: string;
  fullName: string;
  userName: string;
  password: string;
}

export interface User {
  UserId: string;
  userName: string;
}

export interface Profile extends Document {
  userId: mongoose.Types.ObjectId;
  userName: string;
  avatar: string;
  postsCount: number;
  followersCount: number;
  followingCount: number;
  bio: string;
  website?: string;
}

// Интерфейс для API-ответа профиля
export interface profileResponse {
  userId: string; // Изменено для согласованности
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
  }
}

// Интерфейс для поста
export interface Post {
  userId: Types.ObjectId;
  imageUrl: string;
  userName: string;
  caption: string;
  likesCount: number;
  commentsCount: number;
  createdAt: Date;
  profileImage?: string;
  PostId: string;
}
// Интерфейс для компонентов с лентой постов
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

/// Интерфейс для токена
export interface DecodedToken extends JwtPayload {
  userId: string; // Изменено для согласованности
}

// Интерфейс для запросов с токеном
export interface RequestWithToken extends Request {
  token?: string;
}

// Интерфейс для формы профиля
export interface ProfileFormProps extends Request {
  profile: Profile;
  userId: string;
}

export type AvatarUploadProps {
  userId: string;
  token: string;
  onAvatarChange?: (avatarUrl: string) => void;
};

export interface FollowPage {
  userId: string;
}

export interface MenuItem {
  name: string;
  path: string;
  iconSrc: string;
}

export interface Like {
  LikeId: string;
  postId: string;
  userId: string;
  createdAt: string;
}

export interface PostFeed {
  userId: string;
}
export type LoginFormProps = {
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
};

export interface ProfileUpdates {
  username?: string;
  bio?: string;
  avatar?: string;
}
export interface CloudinaryUploadResult {
  secure_url: string;  // URL загруженного изображения
  public_id: string;   // Публичный ID изображения в Cloudinary
  url: string;         // Общий URL изображения
  width: number;       // Ширина изображения
  height: number;      // Высота изображения
}

// Интерфейс для обновлений профиля пользователя
export interface ProfileUpdates {
  userName?: string;
  bio?: string;
  avatar?: string; // URL изображения в Cloudinary
}
export interface AuthState {
  user: UserObject | null;
  token: string | null;
  errorMessage: string | null;
  isLoading: boolean;
}