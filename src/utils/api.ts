/*import axios from 'axios';
export const $api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});
// const base_url = "http://localhost:5000/api";
// export  const $api = axios.create({ baseURL: base_url });
$api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // config.headers.Authotization = token ? `Bearer ${token}` : ''
  return config;
}, (error) => {
  return Promise.reject(error);
});
*/
import Cookies from 'js-cookie';
import axios from 'axios';
import { useRouter } from 'next/router';
// Определение базового URL в зависимости от окружения
const base_url = process.env.MODE_ENV === 'production' // Исправлено MODE_ENV на NODE_ENV
  ? 'https://be-social-cxau.com/api'
  : 'http://localhost:3000/api';

// Создание экземпляра axios
export const $api = axios.create({
  baseURL: base_url,
  withCredentials: true,
});

// Интерсептор для запроса: добавление токена в заголовки
$api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Интерсептор для ответа
$api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      const status = error.response.status;
      console.error('API Error Response:', error.response); // Логирование ошибки

      if (status === 401) {
        console.warn("Токен истёк или отсутствует. Перенаправление на страницу входа.");
        Cookies.remove('token');

        // Перенаправление на страницу логина
        if (typeof window !== 'undefined') {
          const router = useRouter();
          router.push('/login');
        }
        throw new Error("Ваша сессия истекла. Пожалуйста, войдите заново.");
      } else {
        console.error('API Error:', error.response?.data || 'Неизвестная ошибка');
      }
    } else if (error.request) {
      console.error('API Error: Нет ответа от сервера', error.request);
    } else {
      console.error('API Error: Ошибка при отправке запроса', error.message);
    }
    return Promise.reject(error);
  }
);

export default $api;
