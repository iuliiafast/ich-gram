import mongoose, { Document } from 'mongoose';
// Интерфейс для документа пользователя
interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  full_name: string;
  avatar?: string;
  bio: string;
  profile_image: string;
  followers_count: number;
  following_count: number;
  posts_count: number;
  created_at: Date;
  _id: string;
}

// Схема пользователя
const userSchema = new mongoose.Schema<IUser>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  full_name: { type: String, required: true },
  bio: { type: String, default: '' },
  profile_image: { type: String, default: '' },
  followers_count: { type: Number, default: 0 },
  following_count: { type: Number, default: 0 },
  posts_count: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now }
});

// Индексы для ускорения поиска
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });

// Модель пользователя с типом IUser
const User = mongoose.model<IUser>('User', userSchema);

export default User;
