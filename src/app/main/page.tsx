import Sidebar from '../../components/Sidebar';
import { cookies } from 'next/headers'; // Импортируем cookies

type MainPageProps = {
  username: string | null;
  errorMessage?: string;
};

// Функция для получения профиля пользователя
async function fetchUserProfile(token: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Ошибка загрузки профиля");
  }

  const data = await response.json();
  return data.username; // Предполагаем, что API возвращает объект с полем username
}

export default async function MainPage() {
  const cookieStore = await cookies(); // Ожидаем куки
  const token = cookieStore.get('token')?.value; // Получаем токен из куки

  // Проверяем, есть ли токен
  if (!token) {
    return (
      <div className="text-red-500 text-center mt-4">
        Вы не авторизованы. Пожалуйста, войдите в систему.
      </div>
    );
  }

  let username: string | null = null;
  let errorMessage: string | null = null;

  try {
    username = await fetchUserProfile(token); // Получаем имя пользователя
  } catch (error) {
    console.error("Ошибка загрузки профиля:", error);
    errorMessage = "Ошибка загрузки профиля";
  }

  // Если есть ошибка, отображаем сообщение
  if (errorMessage) {
    return (
      <p className="text-red-500 text-center mt-4">{errorMessage}</p>
    );
  }

  // Если все прошло успешно, отображаем содержимое
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar /> {/* Боковая панель */}
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
