import jwt from 'jsonwebtoken';

const getUserIdFromToken = (token) => {
  try {
    // Проверяем и декодируем токен
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Используем секретный ключ для проверки токена
    return decoded.user_id; // Предполагаем, что в токене есть поле user_id
  } catch (err) {
    throw new Error('Невалидный токен');
  }
};

export default getUserIdFromToken;
