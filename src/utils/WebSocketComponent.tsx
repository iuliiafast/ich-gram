// WebSocketComponent.tsx (или WebSocketComponent.js, если пишете на JavaScript)
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import Cookies from 'js-cookie';

const WebSocketComponent = () => {
  const [message, setMessage] = useState<string | null>(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const token = Cookies.get('token'); // Получаем токен из cookies

    if (token) {
      // Подключение к WebSocket серверу с передачей токена
      const socketConnection = io('http://localhost:3000', {
        query: { token }, // Передаем токен при подключении
        path: '/socket.io', // Путь, по которому доступен WebSocket сервер
      });

      socketConnection.on('connect', () => {
        console.log('Подключено к WebSocket');
      });

      socketConnection.on('receive_message', (data) => {
        console.log('Получено сообщение:', data);
        setMessage(data.message); // Обновляем состояние с полученным сообщением
      });

      socketConnection.on('disconnect', () => {
        console.log('Отключено от WebSocket');
      });

      setSocket(socketConnection);

      return () => {
        socketConnection.disconnect(); // Отключение сокета при размонтировании
      };
    }
  }, []);

  return (
    <div>
      <h1>WebSocket Component</h1>
      <div>
        <p>Полученное сообщение: {message}</p>
      </div>
    </div>
  );
};

export default WebSocketComponent;
