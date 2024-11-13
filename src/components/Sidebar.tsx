import React, { useState, useCallback, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import axios from 'axios';
import Cookies from 'js-cookie';
import io, { Socket } from 'socket.io-client'; // Import Socket type

function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoginFormVisible, setIsLoginFormVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Form input states
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // WebSocket connection ref
  const socketConnectionRef = React.useRef<Socket | null>(null); // Correctly typed as Socket

  // Effect cleanup for WebSocket connection on unmount
  useEffect(() => {
    return () => {
      if (socketConnectionRef.current) {
        socketConnectionRef.current.disconnect();
        console.log('WebSocket: Отключен');
      }
    };
  }, []);

  // Handle login form submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null); // Clear previous errors

    try {
      const response = await axios.post("/api/auth/login", { username, password }, { withCredentials: true });

      if (response.data.token) {
        Cookies.set("token", response.data.token, { expires: 7 });
        setUserId(response.data.userId);

        // Establish WebSocket connection
        const socketConnection = io('http://localhost:3000', {
          extraHeaders: { Authorization: `Bearer ${response.data.token}` },
        });

        socketConnection.on('connect', () => {
          console.log('WebSocket: Успешно подключен');
        });

        socketConnection.on('disconnect', () => {
          console.log('WebSocket: Отключен');
        });

        socketConnection.on('error', (err) => {
          console.error('WebSocket error:', err);
        });

        // Store socket connection in the ref
        socketConnectionRef.current = socketConnection;

        router.push(`/profile/${response.data.userId}`);
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

  const menuItems = [
    { name: 'Home', path: '/', iconSrc: '/sidebar/haus.svg' },
    { name: 'Search', path: '/search', iconSrc: '/sidebar/search.svg' },
    { name: 'Explore', path: '/explore', iconSrc: '/sidebar/exp.svg' },
    { name: 'Messages', path: '/messages', iconSrc: '/sidebar/mess.svg' },
    { name: 'Notifications', path: '/notifications', iconSrc: '/sidebar/herz.svg' },
    { name: 'Create', path: '/post', iconSrc: '/sidebar/add.svg' },
  ];

  return (
    <div className="fixed top-0 left-0 h-full w-64 bg-white shadow-lg p-4">
      <Image
        src="/logo.svg"
        alt="Logo"
        width={190}
        height={107}
        priority
      />

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

      {/* Button to toggle login form visibility */}
      <button
        onClick={() => setIsLoginFormVisible(!isLoginFormVisible)}
        className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        {isLoginFormVisible ? 'Закрыть' : 'Profile'}
      </button>

      {/* Login form */}
      {isLoginFormVisible && (
        <form onSubmit={handleLogin} className="my-4">
          <input
            type="text"
            placeholder="Имя пользователя"
            className="p-2 mb-2 border rounded w-full"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Пароль"
            className="p-2 mb-2 border rounded w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-red-500 text-center mt-2">{error}</p>}
          {isLoading && <p className="text-center">Загрузка...</p>}
          <button
            type="submit"
            className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-300"
            disabled={isLoading}
          >
            {isLoading ? 'Загрузка...' : 'Log in'}
          </button>
        </form>
      )}
    </div>
  );
}

export default Sidebar;
