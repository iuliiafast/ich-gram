"use client";
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Sidebar = () => {
  const router = useRouter();

  const menuItems = [
    { name: 'Главная', path: '/' },
    { name: 'Поиск', path: '/search' },
    { name: 'Добавить', path: '/add' },
    { name: 'Уведомления', path: '/notifications' },
    { name: 'Профиль', path: '/profile' },
  ];

  const handleRedirect = () => {
    router.push('/new-page');
  };

  return (
    <div className="fixed top-0 left-0 h-full w-64 bg-white shadow-lg p-4">
      <h2 className="text-xl font-bold mb-4">Меню</h2>
      <ul className="space-y-2">
        {menuItems.map((item) => (
          <li key={item.name}>
            <Link href={item.path}>
              <span
                className={`block p-2 rounded cursor-pointer hover:bg-gray-200 ${router.pathname === item.path ? 'font-bold bg-gray-300' : ''
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
        onClick={handleRedirect}
        className="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Перейти на новую страницу
      </button>
    </div>
  );
};

export default Sidebar;
