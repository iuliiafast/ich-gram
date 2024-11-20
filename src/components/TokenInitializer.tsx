"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import $api from '../utils/api';
//import Cookies from 'js-cookie';

const TokenInitializer = () => {
  const router = useRouter();

  useEffect(() => {
    // Пытаемся проверить токен через запрос на сервер
    const checkTokenValidity = async () => {
      try {
        const response = await $api.get('/validate-token');  // Запрос на сервер для проверки токена
        console.log('Токен валиден:', response.data);

        // Перенаправляем пользователя на нужную страницу, если токен валиден
        router.push('/');
      } catch (error) {
        console.log('Токен невалиден или не найден:', error);

        // Если токен невалиден или отсутствует, перенаправляем на страницу логина
        router.push('/login');
      }
    };

    checkTokenValidity();
  }, [router]);

  return null;
};

export default TokenInitializer;
