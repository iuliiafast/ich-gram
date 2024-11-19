import User from '../models/userModel.js';

export const getAvatar = async (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    return res.status(400).json({ error: 'Не указан userId' });
  }
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }
    res.status(200).json({ avatar: user.avatar || '/default-avatar.png' });
  } catch (error) {
    console.error('Ошибка при получении аватара:', error.message);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};
export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file || !req.file.path) {
      return res.status(400).json({ error: 'Файл не загружен' });
    }
    const avatarUrl = req.file.path;
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }
    user.avatar = avatarUrl;
    await user.save();
    res.status(200).json({ avatar: avatarUrl, message: 'Аватар загружен успешно' });
  } catch (error) {
    console.error('Ошибка при загрузке аватара:', error.message);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};
export const updateAvatar = async (req, res) => {
  try {
    if (!req.file || !req.file.path) {
      return res.status(400).json({ error: 'Файл не загружен' });
    }
    const avatarUrl = req.file.path;
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }
    user.avatar = avatarUrl;
    await user.save();
    res.status(200).json({ avatar: avatarUrl, message: 'Аватар обновлён успешно' });
  } catch (error) {
    console.error('Ошибка при обновлении аватара:', error.message);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};
