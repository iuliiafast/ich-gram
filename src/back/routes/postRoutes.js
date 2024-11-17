import express from 'express';
import upload from '../middlewares/multer.js';
import { createPost, getPostById, updatePost, deletePost, getPosts, getAllPosts } from '../controllers/postController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { getAvatar, uploadAvatar, updateAvatar } from '../controllers/avatarController.js';

const router = express.Router();

// Создание нового поста
router.post('/', authMiddleware, upload.single('image'), createPost);
// Загрузка нового аватара
router.post('/upload-avatar', authMiddleware, upload.single('avatar'), uploadAvatar);
// Изменение существующего аватара
router.put('/update-avatar', authMiddleware, upload.single('avatar'), updateAvatar);
// Получение аватара по userId
router.get('/avatar/:userId', authMiddleware, getAvatar);
// Получение поста по ID
router.get('/single/:postId', authMiddleware, getPostById);
// Обновление поста
router.put('/:postId', authMiddleware, updatePost);
// Удаление поста
router.delete('/:postId', authMiddleware, deletePost);
// Получение всех постов пользователя
router.get('/all', authMiddleware, getPosts);
// Получение всех постов
router.get('/all/public', authMiddleware, getAllPosts);

export default router;
