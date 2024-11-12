"use client";
/*import { useEffect } from "react";
import Image from 'next/image';
import Container from '../../components/Container';
import Link from 'next/link';
import Cookies from 'js-cookie';
import dynamic from 'next/dynamic';
import { io } from 'socket.io-client';
import { LoginForm } from '../../components/LoginForm';

// Динамически загружаем компонент WebSocket
const WebSocketComponent = dynamic(() => import('../../utils/WebSocketComponent'), {
  ssr: false,
});

export default function LoginPage() {
  // Эффект для подключения WebSocket после успешного логина
  useEffect(() => {
    const token = Cookies.get('token');
    console.log("Токен из cookies:", token);  // Проверка токена
    if (token) {
      const socketConnection = io('http://localhost:3000', {
        extraHeaders: {
          Authorization: `Bearer ${token}`,
        },
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

      return () => {
        socketConnection.disconnect();
      };
    } else {
      console.log('Токен не найден в cookies');
    }
  }, []);*/
"use client";
import { useEffect } from "react";
import React from 'react';
import Cookies from "js-cookie";
import dynamic from 'next/dynamic';
import { useRouter } from "next/navigation";
import { io } from 'socket.io-client';
import Container from '../../components/Container';
import { LoginForm } from '../../components/LoginForm';
import Link from 'next/link';
import Image from 'next/image';

const WebSocketComponent = dynamic(() => import('../../utils/WebSocketComponent'), {
  ssr: false,
});

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('token');
    console.log("Токен из cookies:", token);

    if (token) {
      // Инициализация WebSocket-соединения с токеном
      const socketConnection = io('http://localhost:3000', {
        extraHeaders: {
          Authorization: `Bearer ${token}`,
        },
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

      // Отключение сокета при размонтировании компонента
      return () => {
        socketConnection.disconnect();
      };
    } else {
      // Если токен не найден, перенаправление на страницу авторизации
      console.log('Токен не найден. Переход на страницу авторизации.');
      //router.push("/");
    }
  }, [router]);

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
            <Image src="/logo.svg" alt="logo" width={190} height={107} priority />
            {/* Вставляем компонент LoginForm */}
            <LoginForm />
          </div>
          <WebSocketComponent />

          <div className="flex flex-raw items-center border rounded-lg p-8 w-full max-w-md bg-white shadow-md">
            <span>Don't have an account? <Link href="/register" className="text-blue-600 hover:underline">Sign up</Link></span>
          </div>
        </Container>
      </article>
    </>
  );
}
