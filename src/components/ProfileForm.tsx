"use client";
import React, { useState, useEffect, useCallback } from "react";
import axios, { AxiosError } from "axios";
import AvatarUpload from "./AvatarUpload";
import Cookies from "js-cookie";
import Image from 'next/image';

interface UserProfile {
  username: string;
  bio: string;
  profile_image?: string;
}

interface ProfileFormProps {
  userProfile: UserProfile;
  userId: string;
}

const ProfileForm = ({ userId }: ProfileFormProps) => {
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
    <div>
      {isLoading && <p>Загрузка...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Имя:</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Введите имя"
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Введите email"
          />
        </div>
        <div>
          <label htmlFor="bio">Биография:</label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Введите биографию"
          />
        </div>

        {/* Avatar Upload Section */}
        <AvatarUpload userId={userId} token={token!} onAvatarChange={setAvatarUrl} />

        <button type="submit" disabled={isLoading}>Обновить</button>
      </form>

      {/* Display Avatar */}
      {avatarUrl && <div> <Image
        src={avatarUrl}
        alt="User Avatar"
        width={150}
        height={150}
        placeholder="blur" // необязательно, добавляет эффект размытия до полной загрузки
      /></div>}
    </div>
  );
};

export default ProfileForm;
