import { loadMessages, sendMessage } from '../controllers/messageController.js';

export const messageSocketHandler = (socket, io) => {
    // Подключение пользователя к комнате
    socket.on('joinRoom', ({ targetUserId }) => {
        const userId = socket.user?._id;
        if (!userId) {
            return socket.emit('error', 'Пользователь не найден или не аутентифицирован.');
        }

        // Создаем уникальный идентификатор комнаты для общения
        const roomId = [userId, targetUserId].sort().join('_');
        socket.join(roomId); // Подключаем пользователя к комнате
        console.log(`User ${userId} joined room ${roomId}`);

        // Загружаем сообщения для этой комнаты
        loadMessages(userId, targetUserId, socket);
    });

    // Отправка сообщения
    socket.on('sendMessage', ({ targetUserId, messageText }) => {
        const userId = socket.user?._id;
        if (!userId) {
            return socket.emit('error', 'Пользователь не найден или не аутентифицирован.');
        }

        const roomId = [userId, targetUserId].sort().join('_');

        // Теперь используем roomId для отправки сообщения
        sendMessage(userId, targetUserId, messageText, roomId, io);
    });

    // Обработка отключения клиента
    socket.on('disconnect', () => {
        console.log(`User ${socket.user?._id} disconnected`);
    });
};


