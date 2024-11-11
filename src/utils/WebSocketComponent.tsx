import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import Cookies from 'js-cookie';

const WebSocketComponent = () => {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const token = Cookies.get('token'); // Получаем токен из cookies

    if (token) {
      // Подключение к WebSocket серверу с передачей токена через auth
      const socketConnection = io('http://localhost:3000', {
        auth: { token }, // Используем auth для передачи токена
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

      socketConnection.on('connect_error', (error) => {
        console.error('Ошибка подключения:', error.message);
      });
      // Отключаем сокет при размонтировании компонента
      return () => {
        socketConnection.disconnect();
      };
    } else {
      console.log('Токен не найден в cookies');
    }
  }, []); // useEffect с пустым массивом зависимостей, вызывается только один раз

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
