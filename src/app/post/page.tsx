"use client";
import Sidebar from '../../components/Sidebar';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';

type UserProfileResponse = {
  username: string;
};

type ErrorProps = {
  message: string;
};

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

  useEffect(() => {
    const token = Cookies.get('token');

    if (!token) {
      setErrorMessage("Вы не авторизованы. Пожалуйста, войдите в систему.");
      return;
    }

    // Получаем профиль пользователя с помощью токена
    fetchUserProfile(token)
      .then(setUsername)
      .catch((error) => {
        console.error("Ошибка загрузки профиля:", error);
        setErrorMessage(error.message || "Ошибка загрузки профиля");
      });
  }, []);

  if (errorMessage) {
    return <ErrorMessage message={errorMessage} />;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="ml-64 p-6 flex-grow bg-white shadow-md rounded-lg m-4">
        <h1 className="text-3xl font-semibold text-gray-800 mb-4">
          Добро пожаловать, {username}!
        </h1>
        <div className="content-area">
          <section className="main-section">
            <main role="main">
              <div className="posts-container">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid-content p-4 bg-gray-50 rounded-lg shadow-lg">
                    <p>Это ваш защищённый контент.</p>
                  </div>
                </div>
              </div>
            </main>
          </section>
        </div>
      </div>
    </div>
  );
}
