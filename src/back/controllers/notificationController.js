import Notification from '../models/notificationModel.js';
import UserModel from '../models/userModel.js';

export const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ profileId: req.params.profileId })
            .sort({ createdAt: -1 })
            .populate('profileId'); // Если нужно подгрузить данные профиля
        res.status(200).json(notifications);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ error: 'Ошибка при получении уведомлений' });
    }
};

export const createNotification = async (req, res) => {
    const { profileId, type, message, sourceId } = req.body;

    try {
        // Проверка, существует ли профиль
        const profileExists = await UserModel.findById(profileId);
        if (!profileExists) {
            return res.status(404).json({ error: 'Профиль не найден' });
        }

        // Создание нового уведомления
        const notification = new Notification({
            profileId,
            type,
            message,
            sourceId,
            createdAt: new Date(), // timestamps автоматически добавляются, можно убрать
        });

        await notification.save();
        res.status(201).json(notification);
    } catch (error) {
        console.error('Error creating notification:', error);
        res.status(500).json({ error: 'Ошибка при создании уведомления' });
    }
};

export const deleteNotification = async (req, res) => {
    try {
        // Поиск уведомления
        const notification = await Notification.findById(req.params.notificationId);
        if (!notification) {
            return res.status(404).json({ error: 'Уведомление не найдено' });
        }

        // Удаление уведомления
        await notification.remove();
        res.status(200).json({ message: 'Уведомление удалено' });
    } catch (error) {
        console.error('Error deleting notification:', error);
        res.status(500).json({ error: 'Ошибка при удалении уведомления' });
    }
};

export const updateNotificationStatus = async (req, res) => {
    try {
        // Поиск уведомления
        const notification = await Notification.findById(req.params.notificationId);
        if (!notification) {
            return res.status(404).json({ error: 'Уведомление не найдено' });
        }

        // Обновление статуса уведомления
        notification.read = req.body.read;
        await notification.save();
        res.status(200).json(notification);
    } catch (error) {
        console.error('Error updating notification status:', error);
        res.status(500).json({ error: 'Ошибка при обновлении статуса уведомления' });
    }
};
