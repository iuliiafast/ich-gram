"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from 'next/image';
import Container from '../../components/Container';
import Link from 'next/link';
import Cookies from 'js-cookie';
import dynamic from 'next/dynamic';
import { io } from 'socket.io-client';
import { Socket } from 'socket.io-client';

// Динамически загружаем компонент, который использует WebSocket
const WebSocketComponent = dynamic(() => import('../../utils/WebSocketComponent'), {
  ssr: false, // Указываем, что это компонент для клиентской стороны
});

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const router = useRouter();

  // Функция для логина
  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);
    try {
      const response = await axios.post(
        "/api/auth/login",
        { identifier: username, password },
        { withCredentials: true }
      );
      const token = response.data.token;
      if (token) {
        Cookies.set('token', token, { expires: 7 }); // Сохранение токена на 7 дней
      }

      console.log(response.data.message);
      router.push(`/api/user/profile/${response.data.userId}`); // перенаправление после успешного логина
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || 'Ошибка входа';
        setErrorMessage(message);
        console.error('Ошибка входа:', message);
      } else {
        setErrorMessage('Ошибка входа');
        console.error('Ошибка входа');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Эффект для подключения WebSocket после успешного логина
  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      const socketConnection = io('http://localhost:3000', {
        query: { token },
      });

      socketConnection.on('connect', () => {
        console.log('Подключение успешно установлено!');
      });

      socketConnection.on('message', (data) => {
        console.log(data);
      });

      socketConnection.on('connect_error', (err) => {
        console.log('Ошибка подключения:', err.message);
      });

      setSocket(socketConnection); // Сохранение сокета в состоянии

      return () => {
        socketConnection.disconnect();
      };
    }
  }, []); // Этот useEffect вызывается только один раз при монтировании компонента

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout', null, { withCredentials: true });
      console.log("Вы успешно вышли из системы");
      Cookies.remove('token'); // Удаление токена
      router.push('/api/auth/login');
    } catch (error) {
      console.error("Ошибка выхода из системы:", error);
      setErrorMessage("Ошибка выхода из системы");
    }
  };

  return (
    <>
      <article className="flex items-center justify-center h-[81vh] w-[80vw] mx-auto gap-6">
        <div className="flex-shrink-0">
          <Image
            src="/index.svg"
            alt="background"
            width={380}
            height={581}
            priority
            className="rounded-md shadow-lg"
          />
        </div>
        <Container>
          <div className="flex flex-col items-center border rounded-lg p-8 w-full max-w-md bg-white shadow-md">
            <Image
              src="/logo.svg"
              alt="logo"
              width={190}
              height={107}
              priority
            />
            <form onSubmit={handleLogin} className="w-full mt-6 space-y-4">
              <div>
                <input
                  type="text"
                  required
                  autoComplete="username"
                  placeholder="Username, or email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="p-2 border rounded w-full"
                />
              </div>
              <div>
                <input
                  type="password"
                  required
                  autoComplete="current-password"
                  placeholder="Введите пароль"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="p-2 border rounded w-full"
                />
              </div>
              {errorMessage && (
                <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
              )}
              <button
                type="submit"
                className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-300"
                disabled={isLoading}
              >
                {isLoading ? 'Загрузка...' : 'Log in'}
              </button>
              <div className="flex items-center mt-6">
                <hr className="flex-grow border-t border-gray-300" />
                <span className="px-2 text-gray-500">OR</span>
                <hr className="flex-grow border-gray-300" />
              </div>
              <Link href="/reset" className="text-blue-600 hover:underline">Forgot password?</Link>
            </form>
          </div>

          <div className="flex flex-raw items-center border rounded-lg p-8 w-full max-w-md bg-white shadow-md">
            <span>Don't have an account? <Link href="/register" className="text-blue-600 hover:underline">Sign up</Link></span>
          </div>
        </Container>
      </article>
    </>
  );
}
