"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Используем useRouter для получения параметра userId
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import ProfileForm from "../../../components/ProfileForm";
import Footer from "../../../components/Footer";
import PostFeed from "../../../components/PostFeed";
import Sidebar from "../../../components/Sidebar";

interface UserProfile {
  username: string;
  bio: string;
  profile_image?: string;
}

interface Post {
  id: string;
  title: string;
  content: string;
  image?: string;
  createdAt: string;
}

const ProfilePage = () => {
  const router = useRouter();
  const { userId } = router.query; // Получаем userId из URL параметра
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const token = Cookies.get("token"); // Получаем токен из cookies

  useEffect(() => {
    // Проверка наличия userId и токена
    if (!userId) {
      setErrorMessage("Отсутствует идентификатор пользователя.");
      return;
    }

    if (!token) {
      setErrorMessage("Не удалось авторизоваться: токен отсутствует.");
      return;
    }

    const fetchProfileAndPosts = async () => {
      setIsLoading(true);
      try {
        const [profileResponse, postsResponse] = await Promise.all([
          axios.get(`/api/user/profile/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`/api/user/${userId}/posts`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (profileResponse.status === 200) {
          setUserProfile(profileResponse.data);
        } else {
          throw new Error(`Ошибка при загрузке профиля: ${profileResponse.statusText}`);
        }

        if (postsResponse.status === 200) {
          setPosts(postsResponse.data);
        } else {
          throw new Error(`Ошибка при загрузке постов: ${postsResponse.statusText}`);
        }
      } catch (error: unknown) {
        // Обработка ошибок
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError;
          console.error("Ошибка при загрузке данных с сервера:", error.response?.data);
          setErrorMessage(axiosError.response?.data?.message || "Ошибка при загрузке данных");
        } else {
          setErrorMessage("Произошла непредвиденная ошибка при загрузке данных.");
        }
        console.error("Ошибка при загрузке данных:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileAndPosts();
  }, [userId, token]); // Зависимости useEffect

  return (
    <>
      <div className="container mx-auto p-4">
        <Sidebar />
        {isLoading ? (
          <div>Загрузка...</div>
        ) : errorMessage ? (
          <p className="text-red-500">{errorMessage}</p>
        ) : (
          <div>
            {/* Профиль пользователя */}
            {userProfile ? (
              <>
                <h1 className="text-2xl font-bold mb-4">Профиль {userProfile.username}</h1>
                <ProfileForm userProfile={userProfile} userId={userId as string} />
              </>
            ) : (
              <p>Информация о пользователе недоступна.</p>
            )}

            {/* Лента постов */}
            <h2 className="text-xl font-bold mt-8 mb-4">Посты</h2>
            {posts.length > 0 ? (
              <PostFeed posts={posts} />
            ) : (
              <p>У пользователя пока нет постов.</p>
            )}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default ProfilePage;
