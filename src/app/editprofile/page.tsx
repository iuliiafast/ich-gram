"use client";
import React, { useState, useEffect, useCallback } from "react";
import axios, { AxiosError } from "axios";
import AvatarUpload from "../../components/AvatarUpload";
import Cookies from "js-cookie";
import Image from 'next/image';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';

interface UserProfile {
  username: string;
  bio: string;
  profile_image?: string;
}

interface ProfileFormProps {
  userProfile: UserProfile;
  userId: string;
}

const EditProfile = ({ userId }: ProfileFormProps) => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const token = Cookies.get("token");

  // Функция загрузки данных пользователя
  const fetchUserData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`/api/user/profile/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      // Данные успешно получены, обновляем состояния
      const { name, email, bio, avatar } = response.data;
      setName(name || "");
      setEmail(email || "");
      setBio(bio || "");
      setAvatarUrl(avatar || "/default-avatar.png");  // Устанавливаем дефолтный аватар
    } catch (error) {
      // Обработка ошибок
      if (axios.isAxiosError(error)) {
        if (error.response) {
          setError(`Ошибка: ${error.response.data?.message || 'Неизвестная ошибка'}`);
          console.error('Response error:', error.response);
        } else if (error.request) {
          setError('Не удалось получить данные. Пожалуйста, попробуйте позже.');
          console.error('Request error:', error.request);
        }
      } else {
        setError('Произошла ошибка при подключении.');
        console.error('Connection error:', error);
      }
      setAvatarUrl("/default-avatar.png");  // В случае ошибки устанавливаем дефолтный аватар
    } finally {
      setIsLoading(false); // Завершаем загрузку вне зависимости от результата запроса
    }
  }, [userId, token]);

  useEffect(() => {
    if (!userId || !token) {
      setError("Необходимо авторизоваться или предоставить корректный userId.");
      return;
    }

    fetchUserData();
  }, [userId, token, fetchUserData]);

  // Обработчик формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !bio) {
      setError("Пожалуйста, заполните все поля.");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      await axios.put(
        `/api/user/profile/${userId}`,
        { name, bio },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccessMessage("Профиль успешно обновлен!");
    } catch (error: unknown) {
      const err = error as AxiosError;
      if (err.response && err.response.status === 400) {
        setError("Некорректные данные. Проверьте введённую информацию.");
      } else {
        setError("Не удалось обновить профиль. Попробуйте снова.");
      }
    }

  };

  return (
    <><div className="flex h-screen">
      <Sidebar />
      <h1>Edit profile</h1>
      <div className="flex items-center space-x-4">
        <AvatarUpload userId=
          {userId} token=
          {token!} onAvatarChange=
          {setAvatarUrl}
        />
        <div className=
          "relative">
          {isLoading &&
            <p>
              Загрузка...
            </p>}
          {error &&
            <p style={{ color: "red" }}>
              {error}
            </p>}
          {successMessage &&
            <p style=
              {{ color: "green" }}>
              {successMessage}
            </p>}
          {avatarUrl &&
            <div>
              <Image src=
                {avatarUrl} alt=
                "User Avatar"
                width={150}
                height={150}
                placeholder="blur" // необязательно, добавляет эффект размытия до полной загрузки
              />
            </div>}
        </div>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name">
              Username
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Введите имя"
            />
          </div>
          <div>
            <label htmlFor="email">
              Website
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="<a></a>"
            />
          </div>
          <div>
            <label htmlFor="bio">About</label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Введите биографию"
            />
          </div>
          <button type="submit" disabled={isLoading}>
            Save
          </button>
        </form>

        <Footer />
      </div>
    </div>
    </>
  );
};

export default EditProfile;
