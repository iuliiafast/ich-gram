"use client";
import React, { useState, useEffect } from "react";
import $api from "../utils/api";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";

const ProfileButton = ({ userId, token }: { userId: string, token: string }) => {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    if (!userId) {
      console.error("userId is undefined or null");
      setErrorMessage("userId is not available");
      return;
    }
    const fetchAvatar = async () => {
      try {
        const response = await $api.get(`/avatar/${userId}`);

        const fetchedAvatar = response.data?.avatar || `/default-avatar.png`;
        setAvatarUrl(fetchedAvatar);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Ошибка при загрузке аватара:", error.response?.data || error.message);
          setErrorMessage("Не удалось загрузить аватар.");
        } else {
          console.error("Неизвестная ошибка:", error);
          setErrorMessage("Произошла неизвестная ошибка.");
        }
        setAvatarUrl(`/default-avatar.png`);
      }
    };

    fetchAvatar();
  }, [userId, token]);

  const handleClick = () => {
    router.push(`/profile/${userId}`);
  };

  return (
    <div>
      <button onClick={handleClick} className="profile-button">
        <Image
          src={avatarUrl || `/default-avatar.png`}
          alt="Avatar"
          width="40"
          height="40"
          style={{ borderRadius: "50%" }}
        />
        Перейти в профиль
      </button>

      {/* Сообщение об ошибке, если есть */}
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
    </div>
  );
};
export default ProfileButton;