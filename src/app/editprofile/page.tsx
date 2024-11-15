"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import Image from "next/image";
import AvatarUpload from "../../../components/AvatarUpload"; // Путь к компоненту загрузки аватара
import { UserProfile } from "../../../utils/types";

const ProfilePage = () => {
  const { userId } = useParams(); // Извлекаем userId из параметров маршрута
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [name, setName] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [avatarUrl, setAvatarUrl] = useState<string>("/default-avatar.png");
  const [website, setWebsite] = useState<string>(""); // Для нового поля website
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const token = Cookies.get("token");

  useEffect(() => {
    if (!userId || !token) {
      setErrorMessage("Не удалось авторизоваться или отсутствует идентификатор пользователя.");
      return;
    }

    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const profileResponse = await axios.get(`/api/user/profile/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const profileData = profileResponse.data;
        setUserProfile(profileData);
        setName(profileData.username || "");
        setBio(profileData.bio || "");
        setAvatarUrl(profileData.profile_image || "/default-avatar.png");
        setWebsite(profileData.website || ""); // Загружаем данные о вебсайте, если они есть
      } catch (error) {
        const axiosError = error as AxiosError<{ message?: string }>;
        setErrorMessage(axiosError.response?.data?.message || "Ошибка при загрузке данных");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [userId, token]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await axios.put(
        `/api/user/profile/${userId}`,
        { username: name, bio, website }, // Добавляем website в запрос
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSuccessMessage("Профиль успешно обновлен!");
    } catch (error) {
      const err = error as AxiosError;
      setErrorMessage(err.response?.data?.message || "Не удалось обновить профиль. Попробуйте снова.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      {isLoading ? (
        <p>Загрузка...</p>
      ) : errorMessage ? (
        <p style={{ color: "red" }}>{errorMessage}</p>
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-4">Профиль {userProfile?.username}</h1>

          {/* Блок с аватаром и кнопкой загрузки */}
          <div className="shadow-lg p-4 mb-4">
            <div className="flex items-center mb-4">
              <div>
                {avatarUrl && (
                  <Image
                    src={avatarUrl}
                    alt="User Avatar"
                    width={150}
                    height={150}
                    className="rounded-full"
                  />
                )}
              </div>
              <div className="ml-4">
                <AvatarUpload userId={userId as string} token={token!} onAvatarChange={setAvatarUrl} />
              </div>
            </div>
          </div>

          {/* Дополнительный блок между аватаром и формой */}
          <div className="shadow-lg p-4 mb-4">
            <h2 className="text-xl font-bold mb-4">Информация о пользователе</h2>
            <div className="mb-4">
              <strong>Имя:</strong>
              <p>{name}</p>
            </div>
            <div className="mb-4">
              <strong>Биография:</strong>
              <p>{bio}</p>
            </div>
            {website && (
              <div className="mb-4">
                <strong>Вебсайт:</strong>
                <p>{website}</p>
              </div>
            )}
          </div>

          {/* Форма для редактирования профиля */}
          <div className="shadow-lg p-4 mb-4">
            <form onSubmit={handleProfileUpdate}>
              <div className="mb-4">
                <label htmlFor="name" className="block">Имя:</label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Введите имя"
                  className="border p-2 w-full"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="bio" className="block">Биография:</label>
                <textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Введите биографию"
                  className="border p-2 w-full"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="website" className="block">Вебсайт:</label>
                <input
                  id="website"
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="Введите URL вашего вебсайта"
                  className="border p-2 w-full"
                />
              </div>

              <button type="submit" disabled={isLoading} className="bg-blue-500 text-white p-2 rounded">
                Обновить профиль
              </button>
            </form>
            {successMessage && <p style={{ color: "green", marginTop: "10px" }}>{successMessage}</p>}
          </div>
        </>
      )}
    </div>
  );
};

export default ProfilePage;
