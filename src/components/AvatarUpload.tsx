"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { CldImage } from "next-cloudinary";
import mongoose from "mongoose";

type AvatarUploadProps = {
  userId: string;
  token: string;
  onAvatarChange: (avatarUrl: string) => void;
};

const AvatarUpload = ({ userId, token, onAvatarChange }: AvatarUploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!userId || !token) {
      console.error("Отсутствует идентификатор пользователя или токен");
      setAvatarUrl("/default-avatar.png");
      setError("Невозможно загрузить аватар: отсутствуют данные.");
      return;
    }
    // Логирование перед отправкой запроса
    console.log("userId перед отправкой:", userId);

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.error("Некорректный формат userId:", userId);
      setError("Некорректный ID пользователя.");
      setAvatarUrl("/default-avatar.png");
      return;
    }

    const fetchUserAvatar = async () => {
      try {
        const response = await axios.get(`/api/user/profile/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        const avatar = response.data.avatar || "/default-avatar.png";
        setAvatarUrl(avatar);
        onAvatarChange(avatar);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Ошибка статуса:", error.response?.status);
          console.error("Данные ошибки:", error.response?.data);
          if (error.response?.status === 400) {
            setError(`Ошибка: ${error.response?.data?.message || "Ошибка загрузки аватара"}`);
          } else {
            setError("Произошла ошибка при подключении.");
          }
          setAvatarUrl("/default-avatar.png");
        } else {
          console.error("Неизвестная ошибка:", error);
          setError("Произошла ошибка при подключении.");
          setAvatarUrl("/default-avatar.png");
        }
      }
    };

    fetchUserAvatar();
  }, [userId, token, onAvatarChange]);


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(""); // Сброс ошибки при выборе нового файла
    } else {
      setError("Пожалуйста, выберите файл изображения.");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Пожалуйста, выберите изображение");
      return;
    }

    const formData = new FormData();
    formData.append("avatar", file);

    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "/api/user/profile/upload-avatar",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const avatarUrl = response.data.secure_url;
      setAvatarUrl(avatarUrl);
      onAvatarChange(avatarUrl);
      setFile(null);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Ошибка при загрузке аватара:", error.response || error);
      } else {
        console.error("Неизвестная ошибка при загрузке аватара:", error);
      }
      setError("Не удалось загрузить изображение. Попробуйте снова.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {avatarUrl ? (
        <CldImage
          src={avatarUrl}
          width="150"
          height="150"
          crop="fill"
          alt="User Avatar"
          quality="auto"
          format="auto"
        />
      ) : (
        <p>Аватар не найден</p>
      )}

      {/* Поле для выбора файла */}
      <input type="file" onChange={handleFileChange} accept="image/*" />

      {/* Кнопка для загрузки изображения */}
      <button
        type="button"
        onClick={handleUpload}
        disabled={isLoading}
        className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none"
      >
        {isLoading ? "Загрузка..." : "Загрузить изображение"}
      </button>

      {/* Ошибка при загрузке */}
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default AvatarUpload;
