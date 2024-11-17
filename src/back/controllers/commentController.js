import Comment from '../models/commentModel.js';
import Post from '../models/postModel.js';

export const getPostComments = async (req, res) => {
    try {
        const comments = await Comment.find({ postId: req.params.postId });
        res.status(200).json(comments);
    }
    catch (error) {
        console.error("Error fetching comments:", error);
        res.status(500).json({ error: 'Ошибка при получении комментариев' });
    }
};
export const createComment = async (req, res) => {
    const { postId, userId } = req.params;
    const { commentText } = req.body;
    try {
        const post = await Post.findById(postId);
        if (!post)
            return res.status(404).json({ error: 'Пост не найден' });
        const comment = new Comment({
            postId: postId,
            userId: userId,
            commentText,
            createdAt: new Date(),
        });
        await comment.save();
        post.commentsCount += 1;
        await post.save();
        res.status(201).json(comment);
    }
    catch (error) {
        console.error('Error creating comment:', error);
        res.status(500).json({ error: 'Ошибка при создании комментария' });
    }
};
export const deleteComment = async (req, res) => {
    const { commentId } = req.params;
    try {
        const comment = await Comment.findById(commentId);
        if (!comment)
            return res.status(404).json({ error: 'Комментарий не найден' });
        await Comment.findByIdAndDelete(commentId);
        const post = await Post.findById(comment.postId);
        post.commentsCount -= 1;
        await post.save();
        res.status(200).json({ message: 'Комментарий удалён' });
    }
    catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ error: 'Ошибка при удалении комментария' });
    }
};
