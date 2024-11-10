"use client";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

type Notification = {
  id: number;
  message: string;
};

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const socket: Socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3000");

    // Получение нового уведомления и обновление состояния
    socket.on("newNotification", (data: Notification) => {
      console.log("New Notification:", data);
      setNotifications((prev) => [...prev, data]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="p-4 border rounded-lg shadow-lg bg-white">
      <h2 className="text-xl font-bold mb-4">Уведомления</h2>
      {notifications.length === 0 ? (
        <p>Нет новых уведомлений</p>
      ) : (
        <ul className="space-y-2">
          {notifications.map((notification) => (
            <li key={notification.id} className="border-b pb-2">
              {notification.message}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;
