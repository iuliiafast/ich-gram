"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import ProfileForm from "@components/ProfileForm";
import Footer from "@components/Footer";
import PostFeed from "@components/PostFeed";
import Sidebar from "@components/Sidebar";

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
  const { userId } = useParams();
  const validUserId = Array.isArray(userId) ? userId[0] : userId;
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const token = Cookies.get("token");

  useEffect(() => {
    if (!validUserId) {
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
          axios.get(`/api/user/profile/${validUserId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`/api/user/${validUserId}/posts`, {
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
        // Улучшение обработки ошибок
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
  }, [validUserId, token]);

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
                <ProfileForm userProfile={userProfile} userId={validUserId!} />
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
