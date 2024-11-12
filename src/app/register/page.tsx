"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";

interface UserObject {
  email: string;
  full_name: string;
  username: string;
  password: string;
}

const RegisterPage = () => {
  const [userObject, setUserObject] = useState<UserObject>({
    email: "",
    full_name: "",
    username: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;

  useEffect(() => {
    setErrorMessage(null);
  }, [userObject]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserObject((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const { email, full_name, username, password } = userObject;
    if (!email || !full_name || !username || !password) {
      return "Все поля обязательны для заполнения.";
    }
    if (!emailRegex.test(email)) {
      return "Некорректный формат email.";
    }
    if (!passwordRegex.test(password)) {
      return "Пароль должен содержать хотя бы одну цифру, одну заглавную букву и один специальный символ.";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const error = validateForm();
    if (error) {
      setErrorMessage(error);
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post("/api/auth/register", userObject);
      if (response.data?.token) {
        Cookies.set("token", response.data.token, { expires: 7, sameSite: "lax", secure: false });
        router.push(`/main`);
      }
    } catch (error: unknown) {
      let errorMsg = "Произошла ошибка при регистрации.";
      if (axios.isAxiosError(error)) {
        errorMsg = error.response?.data?.message || "Ошибка от сервера.";
      } else if (error instanceof Error) {
        errorMsg = error.message || "Ошибка при настройке запроса.";
      }
      setErrorMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-80">
        <h1 className="text-2xl font-bold mb-4 text-center">Регистрация</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              onChange={handleChange}
              name="email"
              type="email"
              placeholder="Email"
              className="border border-gray-300 p-2 rounded w-full"
            />
          </div>
          <div>
            <input
              onChange={handleChange}
              name="password"
              type="password"
              placeholder="Пароль"
              className="border border-gray-300 p-2 rounded w-full"
            />
          </div>
          <div>
            <input
              onChange={handleChange}
              name="username"
              type="text"
              placeholder="Имя пользователя"
              className="border border-gray-300 p-2 rounded w-full"
            />
          </div>
          <div>
            <input
              onChange={handleChange}
              name="full_name"
              type="text"
              placeholder="Полное имя"
              className="border border-gray-300 p-2 rounded w-full"
            />
          </div>
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          <button
            type="submit"
            className={`bg-blue-500 text-white p-2 rounded w-full ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? "Загрузка..." : "Зарегистрироваться"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
