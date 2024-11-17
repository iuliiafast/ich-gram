"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../utils/store/thunks/authThunks";
import { RootState, AppDispatch } from "../../utils/store/index";
import { UserObject } from "../../utils/types";

const RegisterPage = () => {
  const [userObject, setUserObject] = useState<UserObject>({
    email: "",
    fullName: "",
    userName: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(""); // Ошибка регистрации
  const dispatch: AppDispatch = useDispatch();
  const { isLoading, errorMessage: reduxErrorMessage } = useSelector(
    (state: RootState) => state.auth
  );
  const router = useRouter();

  // Регулярные выражения для проверки email и пароля
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;

  useEffect(() => {
    if (reduxErrorMessage) {
      setErrorMessage(reduxErrorMessage); // Обновляем ошибку из глобального состояния
    }
  }, [reduxErrorMessage]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserObject((prev: UserObject) => ({ ...prev, [name]: value }));
  };

  const validateForm = (): string | null => {
    const { email, fullName, userName, password } = userObject;
    if (!email || !fullName || !userName || !password) {
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

    const error = validateForm();
    if (error) {
      setErrorMessage(error);
      return;
    }

    // Отправляем thunk для регистрации
    await dispatch(registerUser(userObject));

    // После успешной регистрации можно будет перенаправить
    router.push("/profile"); // Перенаправление на страницу профиля
  };
  return (
    <>
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
                name="userName"
                type="text"
                placeholder="Имя пользователя"
                className="border border-gray-300 p-2 rounded w-full"
              />
            </div>
            <div>
              <input
                onChange={handleChange}
                name="fullName"
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
    </>
  );
};

export default RegisterPage;
