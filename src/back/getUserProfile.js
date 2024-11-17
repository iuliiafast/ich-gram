export const getUserProfile = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден.' });
        }
        const userProfile = {
            userId: user._id,
            userName: user.userName,
            avatar: avatar || 'default-avatar.jpg',
            postsCount: postsCount || 0,
            followersCount: followersCount || 0,
            followingCount: followingCount || 0,
            bio: bio || '',
            website: website || '',
        };
        res.status(200).json(userProfile); // Отправляем данные профиля в ответ
    }
    catch (error) {
        console.error('Ошибка при получении профиля:', error);
        return res.status(500).json({ message: 'Ошибка сервера.' });
    }
};
