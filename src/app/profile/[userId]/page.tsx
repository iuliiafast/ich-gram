"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import Footer from "../../../components/Footer";
import PostFeed from "../../../components/PostFeed";
import Sidebar from "../../../components/Sidebar";
import { Profile } from "../../../utils/types";
import ProtectedRoute from "../../../components/ProtectedRoute";


const ProfilePage = () => {
  const { userId } = useParams(); // Получаем userId из URL параметров
  const router = useRouter(); // Для перехода на другие страницы
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const token = Cookies.get("token");

  useEffect(() => {
    if (!userId) {
      setErrorMessage("Отсутствует идентификатор пользователя.");
      return;
    }

    if (!token) {
      setErrorMessage("Не удалось авторизоваться: токен отсутствует.");
      return;
    }

    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const { data } = await axios.get(`/api/user/profile/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(data);
      } catch (error) {
        if (error instanceof AxiosError) {
          setErrorMessage("Ошибка при загрузке профиля" + error.message);
          console.error("Ошибка Axios:", error.response?.data || error.message);
        } else {
          setErrorMessage("Произошла неизвестная ошибка");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [userId, token]);

  const handleEditProfile = () => {
    router.push(`/editprofile`);
  };

  return (
    <>
      <ProtectedRoute>
        <div className="container mx-auto p-4">
          <Sidebar />
          {isLoading ? (
            <div>Загрузка...</div>
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <div>
              {profile ? (
                <>
                  <h1 className="text-2xl font-bold mb-4">{profile.userName}</h1>
                  <button onClick={handleEditProfile} className="text-blue-500">
                    Редактировать профиль
                  </button>
                </>
              ) : (
                <p>Информация о пользователе недоступна.</p>
              )}
              <h2 className="text-xl font-bold mt-8 mb-4">Посты</h2>
              {/* Обрабатываем userId перед передачей в PostFeed */}
              {typeof userId === "string" ? (
                <PostFeed userId={userId} /> // 
              ) : (
                <p>Неверный идентификатор пользователя.</p>
              )}
            </div>
          )}
        </div>
        <Footer />
      </ProtectedRoute>
    </>
  );
};

export default ProfilePage;
