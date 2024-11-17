import express from 'express';
import { getProfile, updateProfile, uploadAvatar } from '../controllers/userController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
const router = express.Router();
// Получение профиля пользователя
router.get('/profile/:userId', authMiddleware, getProfile);
// Обновление профиля пользователя с загрузкой изображения
router.put('/current', authMiddleware, uploadAvatar, updateProfile);
export default router;
