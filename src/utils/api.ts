import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

// Определение базового URL в зависимости от окружения
const base_url =
  process.env.MODE_ENV === "production"
    ? "https://be-social-cxau.com/api"
    : "http://localhost:5005/api";

// Создание экземпляра axios
export const $api = axios.create({
  baseURL: base_url,
});

// Интерсептор для запроса: добавление токена в заголовки
$api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Интерсептор для ответа: обработка ошибок, например, истекший токен
$api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      const status = error.response.status;
      if (status === 401) {
        console.warn(
          "Токен истёк или отсутствует. Перенаправление на страницу входа."
        );
        Cookies.remove("token");

        // Важно: редирект и управление состоянием модального окна лучше делать в компоненте
        if (typeof window !== "undefined") {
          const router = useRouter();
          router.push("/login");
        }
        // В данном случае модальное окно можно открывать через глобальное состояние
        // Просто вызываем ошибку, которую будет обрабатывать компонент, который показывает модальное окно.
        throw new Error("Ваша сессия истекла. Пожалуйста, войдите заново.");
      } else {
        console.error("API Error:", error.response.data);
      }
    } else {
      console.error("API Error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default $api;
