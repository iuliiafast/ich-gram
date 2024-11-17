import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const jwtSecret = process.env.JWT_SECRET;

/**
 * Генерирует JWT, содержащий profileId
 * @param {Object} profile - объект профиля
 * @returns {string} - JWT токен
 */
export const generateToken = (profile) => {
    return jwt.sign(
        { profileId: profile._id }, // Сохраняем profileId в payload токена
        jwtSecret,
        {
            expiresIn: '3h', // Устанавливаем срок жизни токена
        }
    );
};

/**
 * Извлекает profileId из JWT
 * @param {string} token - JWT токен
 * @returns {string} - profileId, извлечённый из токена
 * @throws {Error} - если токен отсутствует, некорректен или истёк
 */
export const getProfileIdFromToken = (token) => {
    if (!token) {
        throw new Error('Токен не предоставлен');
    }
    try {
        const decoded = jwt.verify(token, jwtSecret);
        return decoded.profileId; // Возвращаем profileId
    } catch (error) {
        console.error('Ошибка при проверке токена:', error);
        throw new Error('Не удалось проверить токен или токен истёк');
    }
};

