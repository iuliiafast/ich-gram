"use client";
import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import Link from "next/link";

export const LoginForm = () => {
  const [userObject, setUserObject] = useState<{ email: string; password: string }>({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post("/api/auth/login", userObject, { withCredentials: true });
      if (response.data.token) {
        Cookies.set("token", response.data.token, { expires: 7 });

        // Подключение к WebSocket после успешного логина
        const socketConnection = io('http://localhost:3000', {
          extraHeaders: {
            Authorization: `Bearer ${response.data.token}`,
          },
        });

        socketConnection.on('connect', () => {
          console.log('WebSocket: Подключение успешно установлено!');
        });

        socketConnection.on('message', (data) => {
          console.log('WebSocket: ', data);
        });

        socketConnection.on('connect_error', (err) => {
          console.log('WebSocket ошибка подключения:', err.message);
        });

        router.push("/profile");
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || "Ошибка авторизации. Проверьте правильность данных.");
      } else {
        setError("Произошла ошибка. Попробуйте позже.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="w-full mt-6 space-y-4">
        <div>
          {error && <p className="text-red-500">{error}</p>}
          <input
            onChange={(e) => setUserObject({ ...userObject, email: e.target.value })}
            type="email"
            placeholder="Email"
            className="p-2 border rounded w-full"
            required
          />
        </div>
        <div>
          <input
            onChange={(e) => setUserObject({ ...userObject, password: e.target.value })}
            type="password"
            placeholder="Пароль"
            className="p-2 border rounded w-full"
            required
          />
        </div>
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
    </>
  );
};
