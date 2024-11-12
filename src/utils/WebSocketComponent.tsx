import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import Cookies from 'js-cookie';

const WebSocketComponent = () => {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const token = Cookies.get('token');

    if (token) {
      const socketConnection = io('http://localhost:3000', {
        auth: { token },
        path: '/socket.io',
      });

      socketConnection.on('connect', () => {
        console.log('Подключено к WebSocket');
      });

      socketConnection.on('receive_message', (data) => {
        console.log('Получено сообщение:', data);
        setMessage(data.message);
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
    <div> {message}</div>
  );
};

export default WebSocketComponent;
