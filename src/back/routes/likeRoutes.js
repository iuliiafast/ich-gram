import express from 'express';
import { getPostLikes, likePost, unlikePost } from '../controllers/likeController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
const router = express.Router();

router.get('/:postId/likes', authMiddleware, getPostLikes);

router.post('/:postId/like/:userId', authMiddleware, likePost);

router.delete('/:postId/unlike/:userId', authMiddleware, unlikePost);
export default router;
