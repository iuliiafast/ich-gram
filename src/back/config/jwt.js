import jwt from 'jsonwebtoken';

// Функция генерации JWT для пользователя
const generateToken = (user) => {
  return jwt.sign(
    { user_id: user._id },  // Включаем в токен ID пользователя
    process.env.JWT_SECRET,  // Используем секретный ключ для подписи
    {
      expiresIn: '3h',  // Время действия токена
    }
  );
};

export default generateToken;
