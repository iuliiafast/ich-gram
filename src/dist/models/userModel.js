import mongoose from 'mongoose';
// Схема пользователя
const userSchema = new mongoose.Schema({
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
const UserModel = mongoose.model('User', userSchema);
export default UserModel;
