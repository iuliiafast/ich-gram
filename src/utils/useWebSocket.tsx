import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

export const useWebSocket = (token: string | null) => {
  const [socket, setSocket] = useState<Socket | null>(null); // Состояние сокета
  const [messages, setMessages] = useState<string[]>([]);    // Состояние для сообщений

  useEffect(() => {
    if (!token) {
      console.log("Токен не найден. Подключение WebSocket невозможно.");
      return;
    }

    // Инициализация соединения
    const socketConnection = io(`http://localhost:3000`, {
      auth: { token },
      path: "/socket.io",
    });

    // Обработчики событий
    socketConnection.on("connect", () => {
      console.log("Подключено к WebSocket");
    });

    socketConnection.on("receive_message", (data) => {
      console.log("Получено сообщение:", data);
      setMessages((prev) => [...prev, data.message]); // Добавляем сообщение в массив
    });

    socketConnection.on("disconnect", () => {
      console.log("Отключено от WebSocket");
    });

    socketConnection.on("connect_error", (error) => {
      console.error("Ошибка подключения:", error.message);
    });

    setSocket(socketConnection);

    // Очистка соединения при размонтировании или изменении токена
    return () => {
      if (socketConnection) {
        socketConnection.disconnect();
        console.log("WebSocket: соединение закрыто.");
      }
    };
  }, [token]); // Зависимость от `token`

  return { socket, messages };
};
