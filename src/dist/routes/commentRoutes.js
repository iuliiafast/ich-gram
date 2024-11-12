/**
 * @swagger
 * /:postId:
 *   post:
 *     summary: Returns a sample message
 *     responses:
 *       200:
 *         description: A successful response
 */
/**
 * @swagger
 * /:postId:
 *   get:
 *     summary: Returns a sample message
 *     responses:
 *       200:
 *         description: A successful response
 */
/**
 * @swagger
 * /:commentId:
 *   delete:
 *     summary: Returns a sample message
 *     responses:
 *       200:
 *         description: A successful response
 */
import express from 'express';
import { createComment, getPostComments, deleteComment } from '../controllers/commentController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
const router = express.Router();
// Добавить комментарий к посту
router.post('/:postId', authMiddleware, createComment);
// Получить все комментарии к посту
router.get('/:postId', authMiddleware, getPostComments);
// Удалить комментарий
router.delete('/:commentId', authMiddleware, deleteComment);
export default router;
