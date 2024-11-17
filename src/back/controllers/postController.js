import Post from '../models/postModel.js';
import User from '../models/userModel.js';
import getIdFromToken from '../utils/helpers.js';
import stream from 'stream';
import cloudinary from '../config/cloudinaryConfig.js';

// Получение постов пользователя
export const getPosts = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ success: false, error: 'Токен не предоставлен' });
        }

        const userId = getIdFromToken(token); // Получаем ID пользователя из токена
        const posts = await Post.find({ userId }).sort({ createdAt: -1 }).exec(); // Ищем посты пользователя

        if (!posts.length || posts.length === 0) {
            return res.status(404).json({ success: false, error: 'Посты не найдены' });
        }

        res.status(200).json({ success: true, posts });
    } catch (error) {
        console.error('Ошибка при получении постов:', error);
        res.status(500).json({ success: false, error: 'Ошибка при получении постов' });
    }
};

// Получение всех постов
export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 }).exec();

        // Если посты не найдены
        if (!posts || posts.length === 0) {
            return res.status(404).json({ success: false, error: 'Нет доступных постов' });
        }

        res.status(200).json({ success: true, posts });
    } catch (error) {
        console.error('Ошибка при получении всех постов:', error);
        res.status(500).json({ success: false, error: 'Ошибка при получении постов' });
    }
};

// Создание поста
export const createPost = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ success: false, error: 'Токен не предоставлен' });
        }

        const userId = getIdFromToken(token);
        const { caption } = req.body;

        if (!req.file) {
            return res.status(400).json({ error: 'Изображение не предоставлено' });
        }

        // Загрузка изображения в Cloudinary
        const uploadImage = () => new Promise((resolve, reject) => {
            const bufferStream = new stream.PassThrough();
            bufferStream.end(req.file.buffer);
            cloudinary.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
                if (error) return reject(error);
                resolve(result.secure_url);
            }).end(req.file.buffer);
        });

        const imageUrl = await uploadImage();
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, error: 'Пользователь не найден' });
        }

        // Создание нового поста
        const post = new Post({
            userId,
            userName: user.userName,
            avatar: user.avatar,
            imageUrl,
            caption,
        });

        await post.save();
        user.postsCount += 1; // Увеличиваем количество постов у пользователя
        await user.save();

        res.status(201).json({ success: true, post });
    } catch (error) {
        console.error('Ошибка при создании поста:', error);
        res.status(500).json({ success: false, error: 'Ошибка при создании поста' });
    }
};

// Удаление поста
export const deletePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ success: false, error: 'Пост не найден' });
        }

        await Post.findByIdAndDelete(postId);

        const user = await User.findById(post.userId);
        if (user) {
            user.postsCount -= 1;
            await user.save();
        }

        res.status(200).json({ success: true, message: 'Пост удалён' });
    } catch (error) {
        console.error('Ошибка при удалении поста:', error);
        res.status(500).json({ success: false, error: 'Ошибка при удалении поста' });
    }
};

// Получение поста по ID
export const getPostById = async (req, res) => {
    try {
        const { postId } = req.params;
        const post = await Post.findById(postId).populate('userId', 'userName avatar');

        if (!post) {
            return res.status(404).json({ success: false, error: 'Пост не найден' });
        }

        res.status(200).json({ success: true, post });
    } catch (error) {
        console.error('Ошибка при получении поста:', error);
        res.status(500).json({ success: false, error: 'Ошибка при получении поста' });
    }
};

// Обновление поста
export const updatePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const { caption, imageUrl } = req.body;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ success: false, error: 'Пост не найден' });
        }

        if (caption) post.caption = caption;
        if (imageUrl) post.imageUrl = imageUrl;

        await post.save();

        res.status(200).json({ success: true, post });
    } catch (error) {
        console.error('Ошибка при обновлении поста:', error);
        res.status(500).json({ success: false, error: 'Ошибка при обновлении поста' });
    }
};
