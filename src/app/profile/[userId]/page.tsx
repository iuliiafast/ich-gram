"use client";
import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../../../utils/store/index";
import { fetchProfile, selectProfile } from "../../../utils/store/slices/profileSlice";
import Footer from "../../../components/Footer";
import PostFeed from "../../../components/PostFeed";
import Sidebar from "../../../components/Sidebar";
import ProtectedRoute from "../../../components/ProtectedRoute";

const ProfilePage = () => {
  const { userId } = useParams(); // Получаем userId из URL параметров
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { profile, isLoading, errorMessage } = useSelector(selectProfile);

  useEffect(() => {
    if (userId) {
      dispatch(fetchProfile(userId as string));
    }
  }, [dispatch, userId]);

  const handleEditProfile = () => {
    router.push(`/editprofile`);
  };

  return (
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
            {userId && <PostFeed userId={userId as string} />}
          </div>
        )}
        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default ProfilePage;
