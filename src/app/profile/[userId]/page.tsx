"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import EditProfile from "../../../components/EditProfile";
import Footer from "../../../components/Footer";
import PostFeed from "../../../components/PostFeed";
import Sidebar from "../../../components/Sidebar";
import { Post, UserProfile } from '../../../utils/types';

const ProfilePage = () => {
  const userId = useParams();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
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

        setUserProfile(profileResponse.data);
        setPosts(postsResponse.data);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError<{ message?: string }>;
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
  }, [userId, token]);

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
            {userProfile ? (
              <>
                <h1 className="text-2xl font-bold mb-4">Профиль {userProfile.username}</h1>
                <EditProfile userProfile={userProfile} userId={userId as string} />
              </>
            ) : (
              <p>Информация о пользователе недоступна.</p>
            )}
            <h2 className="text-xl font-bold mt-8 mb-4">Посты</h2>
            <PostFeed posts={posts} />
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default ProfilePage;
