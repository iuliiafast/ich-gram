"use client";
import React from 'react';
import Sidebar from '../components/Sidebar';
import PostFeed from '../components/PostFeed';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type UserProfileResponse = {
  username: string;
};

type ErrorProps = {
  message: string;
};

const posts = [
  { id: '1', title: 'Пост 1', content: 'Контент поста 1', createdAt: '2024-11-12T12:00:00Z' },
  { id: '2', title: 'Пост 2', content: 'Контент поста 2', createdAt: '2024-11-11T12:00:00Z' },
  { id: '3', title: 'Пост 3', content: 'Контент поста 3', createdAt: '2024-11-10T12:00:00Z' },
];

const ErrorMessage = ({ message }: ErrorProps) => (
  <div className="text-red-500 text-center mt-4">{message}</div>
);

async function fetchUserProfile(token: string): Promise<string> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Ошибка загрузки профиля");
  }

  const data: UserProfileResponse = await response.json();
  return data.username;
}

export default function MainPage() {
  const [username, setUsername] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // Состояние авторизации
  const [isLoading, setIsLoading] = useState<boolean>(true); // Состояние загрузки
  const router = useRouter(); // Для перенаправления

  useEffect(() => {
    const token = Cookies.get('token');

    if (!token) {
      setIsAuthenticated(false); // Пользователь не авторизован
      setIsLoading(false); // Завершаем загрузку
      return;
    }

    // Если токен найден, проверяем профиль
    fetchUserProfile(token)
      .then((username) => {
        setUsername(username);
        setIsAuthenticated(true); // Пользователь авторизован
        setIsLoading(false); // Завершаем загрузку
      })
      .catch((error) => {
        console.error("Ошибка загрузки профиля:", error);
        setErrorMessage(error.message || "Ошибка загрузки профиля");
        setIsAuthenticated(false);
        setIsLoading(false); // Завершаем загрузку
      });
  }, []);

  // Если страница загружается, показываем индикатор загрузки
  if (isLoading) {
    return <div className="text-center">Загрузка...</div>;
  }

  // Если ошибка при загрузке профиля, выводим её
  if (errorMessage && isAuthenticated === false) {
    return <ErrorMessage message={errorMessage} />;
  }

  const handlePostClick = (postId: string) => {
    console.log(`Переход на пост с ID: ${postId}`);
    if (!isAuthenticated) {
      // Если пользователь не авторизован, перенаправляем на страницу логина
      router.push('/login');
    } else {
      // Переход к посту для авторизованного пользователя
      router.push(`/posts/${postId}`);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isAuthenticated={isAuthenticated} /> {/* Sidebar всегда виден */}

      <div className="ml-64 p-6 flex-grow bg-white shadow-md rounded-lg m-4">
        <h1 className="text-3xl font-semibold text-gray-800 mb-4">
          Добро пожаловать, {username ? username : 'Гость'}!
        </h1>

        {/* Этот контент показывается всем пользователям */}
        <div className="content-area">
          <section className="main-section">
            <main role="main">
              <div className="posts-container">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid-content p-4 bg-gray-50 rounded-lg shadow-lg">
                    <PostFeed posts={posts} onPostClick={handlePostClick} />
                  </div>
                </div>
              </div>
            </main>
          </section>
        </div>
      </div>

      {/* Footer всегда виден */}
      <footer className="w-full p-4 bg-gray-200 text-center mt-4">
        <p>&copy; 2024 Ваш сайт. Все права защищены.</p>
      </footer>
    </div>
  );
}
