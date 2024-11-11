import jwt, { JwtPayload } from 'jsonwebtoken';

// Функция для извлечения user_id из токена
const getUserIdFromToken = (token: string | undefined): string | null => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET не задан в переменных окружения.');
  }

  if (!token) {
    throw new Error('Токен не предоставлен.');
  }

  try {
    // Декодируем и проверяем токен с использованием секретного ключа
    const decoded = jwt.verify(token, secret) as JwtPayload;

    // Возвращаем user_id, предполагая, что он есть в декодированном токене
    if (decoded && decoded.user_id) {
      return decoded.user_id;
    } else {
      throw new Error('user_id не найден в токене');
    }
  } catch (err) {
    // Обрабатываем ошибку, если токен невалидный или произошла другая ошибка
    console.error('Ошибка при декодировании токена:', err);
    throw new Error('Невалидный токен');
  }
};

export default getUserIdFromToken;
