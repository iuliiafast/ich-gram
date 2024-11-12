// Получение профиля пользователя
export const getUserProfile = async (req, res) => {
    try {
        const user = req.user; // Получаем пользователя из объекта запроса
        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден.' });
        }
        // Формируем данные профиля
        const userProfile = {
            user_id: user._id,
            username: user.username,
            full_name: user.full_name,
            posts_count: user.posts_count,
            followers_count: user.followers_count,
            following_count: user.following_count,
            avatar: user.avatar,
        };
        res.status(200).json(userProfile); // Отправляем данные профиля в ответ
    }
    catch (error) {
        console.error('Ошибка при получении профиля:', error);
        return res.status(500).json({ message: 'Ошибка сервера.' });
    }
};
