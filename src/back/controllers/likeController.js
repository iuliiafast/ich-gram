import Like from '../models/likeModel.js';
import Post from '../models/postModel.js';

export const getPostLikes = async (req, res) => {
    try {
        const likes = await Like.find({ postId: req.params.postId });
        res.status(200).json(likes);
    }
    catch (error) {
        console.error('Error getting likes:', error);
        res.status(500).json({ error: 'Ошибка при получении лайков' });
    }
};
export const likePost = async (req, res) => {
    const { postId, userId } = req.params;
    try {
        const post = await Post.findById(postId);
        if (!post)
            return res.status(404).json({ error: 'Пост не найден' });
        const existingLike = await Like.findOne({ postId: postId, userId });
        if (existingLike)
            return res.status(400).json({ error: 'Пост уже лайкнут' });
        const like = new Like({
            postId: postId,
            userId: userId,
            createdAt: new Date(),
        });
        await like.save();
        post.likesCount += 1;
        await post.save();
        res.status(201).json(like);
    }
    catch (error) {
        console.error('Error liking the post:', error);
        res.status(500).json({ error: 'Ошибка при лайке поста' });
    }
};
export const unlikePost = async (req, res) => {
    const { postId, userId } = req.params;
    try {
        const like = await Like.findOne({ postId: postId, userId });
        if (!like)
            return res.status(404).json({ error: 'Лайк не найден' });
        await Like.findByIdAndDelete(like._id);
        const post = await Post.findById(postId);
        post.likesCount -= 1;
        await post.save();
        res.status(200).json({ message: 'Лайк удалён' });
    }
    catch (error) {
        console.error('Error removing the like:', error);
        res.status(500).json({ error: 'Ошибка при удалении лайка' });
    }
};
