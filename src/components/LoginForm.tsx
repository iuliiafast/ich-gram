import { useState } from "react";
import axios, { AxiosError } from "axios";
import { $api } from "../utils/api";
import Cookies from "js-cookie";

export const LoginForm = () => {
  const [userObject, setUserObject] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await $api.post("/auth/login", userObject);
      // Предположим, что сервер возвращает токен в ответе
      if (response.data.token) {
        Cookies.set("token", response.data.token, { expires: 7 });
        window.location.href = "/profile"; // Перенаправление после успешного входа
      }
    } catch (err: unknown) { // Явно указываем тип unknown
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || "Ошибка авторизации. Проверьте правильность данных.");
      } else {
        setError("Произошла ошибка. Попробуйте позже.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p className="text-red-500">{error}</p>}
      <input
        onChange={(e) => setUserObject({ ...userObject, email: e.target.value })}
        type="email"
        placeholder="Email"
      />
      <input
        onChange={(e) => setUserObject({ ...userObject, password: e.target.value })}
        type="password"
        placeholder="Пароль"
      />
      <button type="submit">Login</button>
    </form>
  );
};
