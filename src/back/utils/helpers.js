import jwt from 'jsonwebtoken';

const getUserIdFromToken = (token) => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET не задан в переменных окружения.');
    }
    if (!token) {
        console.error('Ошибка: Токен не предоставлен.');
        throw new Error('Токен не предоставлен.');
    }
    try {
        const decoded = jwt.verify(token, secret);
        if (decoded && decoded.user_id) {
            return decoded.user_id;
        }
        else {
            console.error('Ошибка: user_id не найден в токене');
            throw new Error('user_id не найден в токене');
        }
    }
    catch (err) {
        console.error('Ошибка при декодировании токена:', err);
        throw new Error('Невалидный токен');
    }
};
export default getUserIdFromToken;
