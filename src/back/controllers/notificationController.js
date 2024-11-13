import Notification from '../models/notificationModel.js';
import User from '../models/userModel.js';
// Получение всех уведомлений пользователя
export const getUserNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ user_id: req.params.userId }).sort({ created_at: -1 });
        res.status(200).json(notifications);
    }
    catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ error: 'Ошибка при получении уведомлений' });
    }
};
// Создание нового уведомления
export const createNotification = async (req, res) => {
    const { userId, type, content } = req.body;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }
        const notification = new Notification({
            user_id: userId,
            type,
            content,
            created_at: new Date(),
        });
        await notification.save();
        res.status(201).json(notification);
    }
    catch (error) {
        console.error('Error creating notification:', error);
        res.status(500).json({ error: 'Ошибка при создании уведомления' });
    }
};
// Удаление уведомления
export const deleteNotification = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.notificationId);
        if (!notification) {
            return res.status(404).json({ error: 'Уведомление не найдено' });
        }
        await Notification.findByIdAndDelete(req.params.notificationId);
        res.status(200).json({ message: 'Уведомление удалено' });
    }
    catch (error) {
        console.error('Error deleting notification:', error);
        res.status(500).json({ error: 'Ошибка при удалении уведомления' });
    }
};
// Обновление статуса уведомления (прочитано/непрочитано)
export const updateNotificationStatus = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.notificationId);
        if (!notification) {
            return res.status(404).json({ error: 'Уведомление не найдено' });
        }
        notification.is_read = req.body.is_read;
        await notification.save();
        res.status(200).json(notification);
    }
    catch (error) {
        console.error('Error updating notification status:', error);
        res.status(500).json({ error: 'Ошибка при обновлении статуса уведомления' });
    }
};
