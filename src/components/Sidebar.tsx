"use client";
import React from 'react';
import Modal from 'antd/es/modal/Modal';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';

function Sidebar({ isAuthenticated }) {
  const router = useRouter();
  const pathname = usePathname(); // Получаем текущий путь

  const menuItems = [
    { name: 'Главная', path: '/' },
    { name: 'Поиск', path: '/search' },
    { name: 'Добавить', path: '/add' },
    { name: 'Уведомления', path: '/notifications' },
    { name: 'Профиль', path: '/profile' },
  ];

  const handleAction = () => {
    if (!isAuthenticated) {
      Modal.info({
        title: 'Требуется авторизация',
        content: 'Пожалуйста, войдите в систему для доступа к этой функции.',
        onOk: () => router.push('/Login'), // Перенаправление после закрытия модального окна
      });
      return;
    }
  };

  const handleRedirect = () => {
    router.push('/new-page');
  };

  return (
    <div className="fixed top-0 left-0 h-full w-64 bg-white shadow-lg p-4">
      <h2 className="text-xl font-bold mb-4">
        <Image
          src="/logo.svg"
          alt="Logo"
          layout="responsive"
          width={190}
          height={107}
        />
      </h2>
      <ul className="space-y-2">
        {menuItems.map((item) => (
          <li key={item.name}>
            <Link href={item.path}>
              <span
                className={`block p-2 rounded cursor-pointer hover:bg-gray-200 ${pathname === item.path ? 'font-bold bg-gray-300' : ''
                  }`}
              >
                {item.name}
              </span>
            </Link>
          </li>
        ))}
      </ul>
      {/* Кнопка для перехода на другую страницу вне списка меню */}
      <button
        onClick={isAuthenticated ? handleRedirect : handleAction}
        className="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Перейти на новую страницу
      </button>
    </div>
  );
}

export default Sidebar;
