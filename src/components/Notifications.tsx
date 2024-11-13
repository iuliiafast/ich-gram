"use client";
import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

// Определяем интерфейс для уведомлений
interface Notification {
  message: string;
  // Можно добавить дополнительные поля, если они есть в данных уведомлений
}

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Подключаем сокет при монтировании компонента
    const socketUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    const socket: Socket = io(socketUrl);


    // Подписываемся на событие уведомления
    socket.on("newNotification", (data: Notification) => {
      console.log("New Notification:", data);
      setNotifications((prev) => [...prev, data]);
    });

    // Отслеживаем ошибки подключения
    socket.on("connect_error", (error) => {
      console.error("Ошибка подключения:", error);
    });

    socket.on("disconnect", (reason) => {
      console.log("Сокет отключён:", reason);
    });

    // Очистка: отключаем сокет при размонтировании компонента
    return () => {
      if (socket) {
        socket.disconnect();
        console.log('Сокет отключён и очищен');
      }
    };
  }, []); // Пустой массив зависимостей для однократного выполнения при монтировании

  return (
    <div className="p-4 border rounded-lg shadow-lg bg-white">
      <h2 className="text-xl font-bold mb-4">Уведомления</h2>
      {notifications.length === 0 ? (
        <p>Нет новых уведомлений</p>
      ) : (
        <ul className="space-y-2">
          {notifications.map((notification, index) => (
            <li key={index}>{notification.message}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;
