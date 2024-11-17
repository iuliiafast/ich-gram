import UserModel from '../models/userModel.js';
import Post from '../models/postModel.js';

export const searchUsers = async (req, res) => {
    const { query } = req.query;
    try {
        const users = await UserModel.find({ userName: { $regex: query, $options: 'i' } }).select('userName bio');
        res.status(200).json(users);
    }
    catch (error) {
        console.error("Ошибка при поиске пользователей:", error);
        res.status(500).json({ error: 'Ошибка при поиске пользователей' });
    }
};
export const searchPosts = async (req, res) => {
    const { query } = req.query;
    try {
        const filter = query ? {
            $or: [
                { content: { $regex: query, $options: 'i' } },
                { caption: { $regex: query, $options: 'i' } }
            ]
        } : {};
        const posts = await Post.find(filter).populate('userId', 'userName');
        res.status(200).json(posts);
    }
    catch (error) {
        console.error("Ошибка:", error);
        res.status(500).json({ error: 'Произошла ошибка' });
    }
};
