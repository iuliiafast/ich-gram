import Notification from '../models/notificationModel.js';
import User from '../models/userModel.js';

export const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.params.userId })
            .sort({ createdAt: -1 })
            .populate('userId', 'name') // Подставить нужные поля пользователя
            .populate('sourceId', 'name'); // Подставить данные источника уведомления

        res.status(200).json(notifications);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ error: 'Ошибка при получении уведомлений' });
    }
};


export const createNotification = async (req, res) => {
    const { userId, type, message, sourceId } = req.body;

    try {
        // Проверка, существует ли профиль
        const userExists = await User.findById(userId);
        if (!userExists) {
            return res.status(404).json({ error: 'Профиль не найден' });
        }

        // Создание нового уведомления
        const notification = new Notification({
            userId,
            type,
            message,
            sourceId,
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
        const notification = await Notification.findById(req.params.notificationId);
        if (!notification) {
            return res.status(404).json({ error: 'Уведомление не найдено' });
        }

        await Notification.deleteOne({ _id: req.params.notificationId }); // Современный способ
        res.status(200).json({ message: 'Уведомление удалено' });
    } catch (error) {
        console.error('Error deleting notification:', error);
        res.status(500).json({ error: 'Ошибка при удалении уведомления' });
    }
};


export const updateNotificationStatus = async (req, res) => {
    const { read } = req.body;

    try {
        const notification = await Notification.findById(req.params.notificationId);
        if (!notification) {
            return res.status(404).json({ error: 'Уведомление не найдено' });
        }

        // Проверка входных данных
        if (typeof read !== 'boolean') {
            return res.status(400).json({ error: 'Некорректное значение read' });
        }

        notification.read = read;
        await notification.save();
        res.status(200).json(notification);
    } catch (error) {
        console.error('Error updating notification status:', error);
        res.status(500).json({ error: 'Ошибка при обновлении статуса уведомления' });
    }
};
