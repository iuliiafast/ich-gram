import PostModel from '../models/postModel.js';
import UserModel from '../models/userModel.js';
import getUserIdFromToken from '../utils/helpers.js';
import stream from 'stream';
import cloudinary from '../config/cloudinaryConfig.js';
// Получение всех постов пользователя
export const getUserPosts = async (req, res) => {
    var _a;
    try {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1]; // Извлекаем токен из заголовка
        if (!token) {
            return res.status(401).json({ success: false, error: 'Токен не предоставлен' });
        }
        const userId = getUserIdFromToken(token);
        const posts = await PostModel.find({ user_id: userId }).exec();
        const postList = posts.map(post => post.toObject());
        if (postList.length === 0) {
            return res.status(404).json({ success: false, error: 'Посты не найдены' });
        }
        return res.status(200).json({ success: true, posts: postList });
    }
    catch (error) {
        console.error("Ошибка при получении постов:", error);
        return res.status(500).json({ success: false, error: 'Ошибка при получении постов' });
    }
};
// Получение всех постов
export const getAllPosts = async (req, res) => {
    try {
        const posts = await PostModel.find().exec();
        const postList = posts.map(post => post.toObject());
        return res.status(200).json({ success: true, posts: postList });
    }
    catch (error) {
        console.error("Ошибка при получении постов:", error);
        return res.status(500).json({ success: false, error: 'Ошибка при получении постов' });
    }
};
// Создание нового поста
export const createPost = async (req, res) => {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (!token) {
        return res.status(401).json({ success: false, error: 'Токен не предоставлен' });
    }
    const userId = getUserIdFromToken(token);
    const { caption } = req.body;
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Изображение не предоставлено' });
        }
        const uploadImage = () => new Promise((resolve, reject) => {
            const bufferStream = new stream.PassThrough();
            bufferStream.end(req.file.buffer);
            const uploadStream = cloudinary.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
                if (error)
                    return reject(error);
                if (result) {
                    resolve(result.secure_url);
                }
                else {
                    reject(new Error("Не удалось загрузить изображение"));
                }
            });
            bufferStream.pipe(uploadStream);
        });
        const image_url = await uploadImage();
        const user = await UserModel.findById(userId);
        if (!user)
            return res.status(404).json({ success: false, error: 'Пользователь не найден' });
        const post = new PostModel({
            user_id: userId,
            image_url,
            user_name: user.username,
            profile_image: user.profile_image,
            caption,
            created_at: new Date(),
        });
        await post.save();
        user.posts_count += 1;
        await user.save();
        return res.status(201).json({ success: true, post: post.toObject() });
    }
    catch (error) {
        console.error("Ошибка при создании поста:", error);
        return res.status(500).json({ success: false, error: 'Ошибка при создании поста' });
    }
};
// Удаление поста
export const deletePost = async (req, res) => {
    const { postId } = req.params;
    try {
        const post = await PostModel.findById(postId);
        if (!post)
            return res.status(404).json({ success: false, error: 'Пост не найден' });
        await PostModel.findByIdAndDelete(postId);
        const user = await UserModel.findById(post.user_id);
        if (user) {
            user.posts_count -= 1;
            await user.save();
        }
        return res.status(200).json({ success: true, message: 'Пост удалён' });
    }
    catch (error) {
        console.error("Ошибка при удалении поста:", error);
        return res.status(500).json({ success: false, error: 'Ошибка при удалении поста' });
    }
};
// Получение поста по ID
export const getPostById = async (req, res) => {
    const { postId } = req.params;
    try {
        const post = await PostModel.findById(postId).populate('user_id', 'username');
        if (!post)
            return res.status(404).json({ success: false, error: 'Пост не найден' });
        return res.status(200).json({ success: true, post: post.toObject() });
    }
    catch (error) {
        console.error("Ошибка при получении поста:", error);
        return res.status(500).json({ success: false, error: 'Ошибка при получении поста' });
    }
};
// Обновление поста
export const updatePost = async (req, res) => {
    const { postId } = req.params;
    const { caption, image_url } = req.body;
    try {
        const post = await PostModel.findById(postId);
        if (!post)
            return res.status(404).json({ success: false, error: 'Пост не найден' });
        if (caption !== undefined)
            post.caption = caption;
        if (image_url !== undefined)
            post.image_url = image_url;
        await post.save();
        return res.status(200).json({ success: true, post: post.toObject() });
    }
    catch (error) {
        console.error("Ошибка при обновлении поста:", error);
        return res.status(500).json({ success: false, error: 'Ошибка при обновлении поста' });
    }
};
