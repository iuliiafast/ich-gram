"use client";
import React, { useState, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import axios from 'axios';
import Cookies from 'js-cookie';
import io from 'socket.io-client';

function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoginFormVisible, setIsLoginFormVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const token = Cookies.get("token");

  // Функция авторизации
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post("/api/auth/login", { withCredentials: true });
      if (response.data.token) {
        Cookies.set("token", response.data.token, { expires: 7 });
        setUserId(response.data.userId);

        const socketConnection = io('http://localhost:3000', {
          extraHeaders: { Authorization: `Bearer ${response.data.token}` },
        });

        socketConnection.on('connect', () => {
          console.log('WebSocket: Успешно подключен');
        });

        router.push(`/profile/${userId}`);
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || "Ошибка авторизации");
      } else {
        setError("Произошла ошибка. Попробуйте позже.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileClick = useCallback(() => {
    if (userId) {
      router.push(`/profile/${userId}`);
    } else {
      console.error('User ID is not available');
    }
  }, [userId, router]);

  const menuItems = [
    { name: 'Home', path: '/', iconSrc: '/sidebar/home.svg' },
    { name: 'Search', path: '/search', iconSrc: '/sidebar/search.svg' },
    { name: 'Explore', path: '/explore', iconSrc: '/sidebar/explore.svg' },
    { name: 'Messages', path: '/messages', iconSrc: '/sidebar/messages.svg' },
    { name: 'Notifications', path: '/notifications', iconSrc: '/sidebar/notifications.svg' },
    { name: 'Create', path: '/post', iconSrc: '/sidebar/create.svg' },
  ];

  return (
    <div className="fixed top-0 left-0 h-full w-64 bg-white shadow-lg p-4">
      <Image src="/logo.svg" alt="Logo" layout="responsive" width={190} height={107} />

      <nav className="w-full my-4">
        {menuItems.map((item) => (
          <button
            key={item.name}
            onClick={() => router.push(item.path)}
            className={`w-full text-left px-6 py-3 mb-2 rounded-lg font-medium 
              ${pathname === item.path ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
          >
            <Image src={item.iconSrc} alt={item.name} width={24} height={24} className="mr-3" />
            {item.name}
          </button>
        ))}
      </nav>

      {/* Кнопка для показа формы входа */}
      <button onClick={() => setIsLoginFormVisible(!isLoginFormVisible)}
        className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        {isLoginFormVisible ? 'Закрыть' : 'Войти'}
      </button>

      {/* Форма входа, видимая при нажатии на кнопку */}
      {isLoginFormVisible && (
        <form onSubmit={handleLogin} className="my-4">
          <input type="text" placeholder="Имя пользователя" className="p-2 mb-2 border rounded w-full" />
          <input type="password" placeholder="Пароль" className="p-2 mb-2 border rounded w-full" />
          <button
            type="submit"
            className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            disabled={isLoading}
          >
            {isLoading ? 'Вход...' : 'Войти'}
          </button>
          {error && <p className="text-red-500 text-center mt-2">{error}</p>}
        </form>
      )}

      {/* Кнопка для перехода в профиль */}
      <button onClick={handleProfileClick} className="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Профиль
      </button>
    </div>
  );
}

export default Sidebar;
