"use client";
import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import axios from 'axios';
import Cookies from 'js-cookie';
import io from 'socket.io-client';

function Sidebar() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const token = Cookies.get("token");

  const fetchUserData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`/api/user/profile/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      const handleProfileClick = () => {
        if (userId) {
          // Переход на страницу профиля с корректным userId
          router.push(`/profile/${userId}`);
        } else {
          // Логика, если userId всё ещё не найден
          console.error('User ID is still not available');
        } catch (error) {
          // Обработка ошибок
          if (axios.isAxiosError(error)) {
            if (error.response) {
              setError(`Ошибка: ${error.response.data?.message || 'Неизвестная ошибка'}`);
              console.error('Response error:', error.response);
            } else if (error.request) {
              setError('Не удалось получить данные. Пожалуйста, попробуйте позже.');
              console.error('Request error:', error.request);
            }
          } else {
            setError('Произошла ошибка при подключении.');
            console.error('Connection error:', error);
          }
          setAvatarUrl("/default-avatar.png");  // В случае ошибки устанавливаем дефолтный аватар
        } finally {
          setIsLoading(false); // Завершаем загрузку вне зависимости от результата запроса
        }
      }, [userId, token]);

  const menuItems = [
    { name: 'Home', path: '/', iconSrc: '/sidebar/haus.svg' },
    { name: 'Search', path: '/search', iconSrc: '/sidebar/haus.svg' },
    { name: 'Explore', path: '/explore', iconSrc: '/sidebar/haus.svg' },
    { name: 'Messages', path: '/messages', iconSrc: '/sidebar/haus.svg' },
    { name: 'Notifications', path: '/notifications', iconSrc: '/sidebar/haus.svg' },
    { name: 'Create', path: '/post', iconSrc: '/sidebar/haus.svg' },
  ];

  const OnClick = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post("/api/auth/login", userObject, { withCredentials: true });
      if (response.data.token) {
        Cookies.set("token", response.data.token, { expires: 7 });

        // Подключение к WebSocket после успешного логина
        const socketConnection = io('http://localhost:3000', {
          extraHeaders: {
            Authorization: `Bearer ${response.data.token}`,
          },
        });

        socketConnection.on('connect', () => {
          console.log('WebSocket: Подключение успешно установлено!');
        });

        socketConnection.on('message', (data) => {
          console.log('WebSocket: ', data);
        });

        socketConnection.on('connect_error', (err) => {
          console.log('WebSocket ошибка подключения:', err.message);
        });

        router.push(`/profile/${userId}`); // Переход к профилю с userId
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || "Ошибка авторизации. Проверьте правильность данных.");
      } else {
        setError("Произошла ошибка. Попробуйте позже.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed top-0 left-0 h-full w-64 bg-white shadow-lg p-4">
      <Image
        src="/logo.svg"
        alt="Logo"
        layout="responsive"
        width={190}
        height={107}
      />
      <nav className="w-full">
        {menuItems.map((item) => (
          <button
            key={item.name}
            onClick={() => router.push(item.path)}
            className={`w-full text-left px-6 py-3 mb-2 rounded-lg font-medium 
              ${pathname === item.path
                ? 'bg-blue-600 text-white'  // Активный стиль
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
          >
            <Image
              src={item.iconSrc}
              alt={item.name}
              width={24}
              height={24}
              className="mr-3"
            />
            {item.name}
          </button>
        ))}
      </nav>

      {/* Кнопка для перехода на профиль */}
      <button onClick={handleProfileClick}
        className="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Profile
      </button>
    </div>
  );
}

export default Sidebar;
