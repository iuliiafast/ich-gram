"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../utils/store/thunks/regThunks";
import { AppDispatch } from "../../utils/store/store";
import { UserRegistration } from "../../utils/types";
import { RootState } from "../../utils/store/store";
import Cookies from "js-cookie";


const RegisterPage = () => {
  const [user, setUser] = useState<UserRegistration>({
    email: "",
    fullName: "",
    userName: "",
    password: "",
    profile: {
      postsCount: 0,
      followersCount: 0,
      followingCount: 0,
      bio: "",
      website: "",
      avatar: "",
    },
  });
  const [errorMessage, setErrorMessage] = useState<string | null>("");
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();
  const isLoading = useSelector((state: RootState) => state.auth.isLoading);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const keys = name.split(".");
    setUser((prev) => {
      if (keys.length > 1) {
        return {
          ...prev,
          profile: {
            ...prev.profile,
            [keys[1]]: value,
          },
        };
      }
      return {
        ...prev,
        [name]: value,
      };
    });
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user.email || !user.password || !user.userName || !user.fullName) {
      setErrorMessage("Пожалуйста, заполните все обязательные поля.");
      return;
    }
    try {
      const result = await dispatch(registerUser(user));
      if (result?.user?._id && result?.token) {
        Cookies.set("token", result.token);
        router.push(`/`);
      } else {
        throw new Error("Ошибка регистрации: пользователь не создан.");
      }
    } catch (error) {
      console.error("Ошибка регистрации:", error);
      setErrorMessage("Ошибка регистрации. Попробуйте еще раз.");
    }
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

/*const { isLoading, errorMessage: reduxErrorMessage } = useSelector(
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
  setUser((prev: User) => ({
    ...prev,
    [name]: value,
  }));
};

/* const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
   const { name, value } = e.target;
   setUser((prev: User) => ({
     ...prev,
     profile: {
       ...prev.profile,
       [name]: value,
     },
   }));
 };

const validateForm = (): string | null => {
  const { email, fullName, userName, password } = user;
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
  try {
    // Отправляем thunk для регистрации
    const registeredUser = await dispatch(userId(user)); // Получаем объект пользователя, включая _id


    // После успешной регистрации перенаправляем на страницу профиля
    router.push(`/profile/${userId}`); // Перенаправление на страницу профиля
  } catch (error) {
    // Обработка ошибок, если регистрация не удалась
    console.error('Registration failed:', error);
    setErrorMessage('Ошибка регистрации. Попробуйте снова.');
  }
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

export default RegisterPage;*/
