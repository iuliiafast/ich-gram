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

router.post('/:postId', authMiddleware, createComment);

router.get('/:postId', authMiddleware, getPostComments);

router.delete('/:commentId', authMiddleware, deleteComment);
export default router;
