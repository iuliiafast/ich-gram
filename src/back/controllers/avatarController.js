import User from '../models/userModel.js';

export const getAvatar = async (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    return res.status(400).json({ error: 'Не указан userId' });
  }

  try {
    // Ищем пользователя по ID
    const user = await User.findById(req.params.userId);

    // Если пользователь не найден, возвращаем ошибку
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    // Отправляем URL аватара, если он есть
    res.status(200).json({ avatar: user.avatar || '/default-avatar.png' });
  } catch (error) {
    console.error('Ошибка при получении аватара:', error.message);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

export const uploadAvatar = async (req, res) => {
  try {
    // Проверяем, есть ли файл в запросе
    if (!req.file || !req.file.path) {
      return res.status(400).json({ error: 'Файл не загружен' });
    }
    const avatarUrl = req.file.path;  // Получаем путь к изображению, загруженному multer

    // Ищем пользователя по ID
    const user = await User.findById(req.user.id);  // Используем req.user.id, если пользователь аутентифицирован

    // Если пользователь не найден, возвращаем ошибку
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    // Сохраняем новый аватар
    user.avatar = avatarUrl;
    await user.save();  // Сохраняем изменения в базе данных

    // Отправляем успешный ответ с новым URL аватара
    res.status(200).json({ avatar: avatarUrl, message: 'Аватар загружен успешно' });
  } catch (error) {
    console.error('Ошибка при загрузке аватара:', error.message);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

export const updateAvatar = async (req, res) => {
  try {
    // Проверяем, есть ли файл в запросе
    if (!req.file || !req.file.path) {
      return res.status(400).json({ error: 'Файл не загружен' });
    }

    const avatarUrl = req.file.path;  // Получаем путь к изображению

    // Ищем пользователя по ID
    const user = await User.findById(req.user.id);

    // Если пользователь не найден, возвращаем ошибку
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    // Обновляем аватар
    user.avatar = avatarUrl;
    await user.save();  // Сохраняем изменения в базе данных

    // Отправляем успешный ответ с новым URL аватара
    res.status(200).json({ avatar: avatarUrl, message: 'Аватар обновлён успешно' });
  } catch (error) {
    console.error('Ошибка при обновлении аватара:', error.message);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};
