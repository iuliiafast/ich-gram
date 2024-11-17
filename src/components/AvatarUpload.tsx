"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { CldImage } from "next-cloudinary";
import { AvatarUploadProps } from "../utils/types";

const AvatarUpload: React.FC<AvatarUploadProps> = ({ userId, token, onAvatarChange }) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [avatarUrl, setAvatarUrl] = useState<string>("/default-avatar.png");

  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        const response = await axios.get(`/api/avatar/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const avatar = response.data.avatar || `/default-avatar.png`;
        setAvatarUrl(avatar);
        onAvatarChange?.(avatar);
      } catch (error) {
        console.error("Ошибка при загрузке аватара:", error);
        setAvatarUrl(`/default-avatar.png`);
        setError("Не удалось загрузить аватар.");
      }
    };

    if (userId && token) fetchAvatar();
  }, [userId, token, onAvatarChange]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError("");
    } else {
      setError("Пожалуйста, выберите файл изображения.");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Пожалуйста, выберите изображение.");
      return;
    }

    const formData = new FormData();
    formData.append("avatar", file);

    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post(
        `/api/avatar/${userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const avatarUrl = response.data.avatar;
      setAvatarUrl(avatarUrl);
      onAvatarChange?.(avatarUrl);
      setFile(null);
    } catch (error) {
      console.error("Ошибка при загрузке аватара:", error);
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

      <input type="file" onChange={handleFileChange} accept="image/*" />
      <button
        type="button"
        onClick={handleUpload}
        disabled={isLoading}
        className={`bg-blue-500 text-white py-2 px-4 rounded-lg ${isLoading ? "cursor-not-allowed opacity-50" : "hover:bg-blue-600"
          }`}
      >
        {isLoading ? "Загрузка..." : "Загрузить изображение"}
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default AvatarUpload;
