import Message from '../models/messageModel.js';

export const loadMessages = async (userId, targetUserId, socket) => {
    try {
        const someFunctionThatReturnsRoomId = () => {
            return "roomId";
        };

        const roomId = someFunctionThatReturnsRoomId();
        console.log(roomId);

        // Загружаем последние 20 сообщений
        const messages = await Message.find({
            $or: [
                { senderId: userId, receiverId: targetUserId },
                { senderId: targetUserId, receiverId: userId },
            ],
        }).sort({ createdAt: 1 })
            .limit(20);

        // Отправляем сообщения обратно на клиент
        socket.emit('loadMessages', messages);
    }
    catch (error) {
        console.error('Ошибка при загрузке сообщений:', error);
        socket.emit('error', { error: 'Ошибка при загрузке сообщений' });
    }
};

export const sendMessage = async (userId, targetUserId, messageText, roomId, io) => {
    try {
        const message = new Message({
            senderId: userId,
            receiverId: targetUserId,
            messageText: messageText,
            createdAt: new Date(),
        });
        await message.save();

        io.to(roomId).emit('receiveMessage', message);
        console.log('Сообщение отправлено:', message);
    }
    catch (error) {
        console.error('Ошибка при отправке сообщения:', error);
    }
};
