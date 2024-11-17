import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    puserId: { type: mongoose.Schema.Types.ObjectId, ref: 'UserModel', required: true },
    avatar: { type: String, default: '' }, // Аватар пользователя
    userName: { type: String, required: true }, // Имя пользователя
    imageUrl: { type: String, required: true }, // URL изображения
    caption: { type: String, default: '' }, // Подпись к посту
    likesCount: { type: Number, default: 0 }, // Количество лайков
    commentsCount: { type: Number, default: 0 }, // Количество комментариев
}, { timestamps: true });

postSchema.index({ profileId: 1 });


const Post = mongoose.model('Post', postSchema);
export default Post;
