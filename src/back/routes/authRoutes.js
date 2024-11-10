/**
 * @swagger
 * /register:
 *   post:
 *     summary: Returns a sample message
 *     responses:
 *       200:
 *         description: A successful response
 */
/**
 * @swagger
 * /login:
 *   post:
 *     summary: Returns a sample message
 *     responses:
 *       200:
 *         description: A successful response
 */


import express from 'express';
import { register, login } from '../controllers/authController.js';

const router = express.Router();

// Регистрация нового пользователя

router.post('/register', register);

// Вход пользователя
router.post('/login', login);

export default router;