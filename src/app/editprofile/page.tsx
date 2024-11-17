"use client";
import React, { useState, useEffect } from "React";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import AvatarUpload from "../../components/AvatarUpload";
import Sidebar from "../../components/Sidebar";
import Footer from "../../components/Footer";
import CldImage from "../../components/CldImage";
import { RootState } from "../../utils/store/index";
import {
  updateProfileStart,
  updateProfileSuccess,
  updateProfileFailure,
} from "../../utils/store/slices/profileSlice";

const ProfileUpdate = ({ userId, token }: { userId: string; token: string }) => {
  const [userName, setUserName] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [website, setWebsite] = useState<string>("");
  const [avatarUrl, setAvatarUrl] = useState<string>("");

  const dispatch = useDispatch();
  const { profile, isLoading, errorMessage, successMessage } = useSelector(
    (state: RootState) => state.profile
  );

  useEffect(() => {
    if (profile) {
      setUserName(profile.userName || "");
      setBio(profile.bio || "");
      setWebsite(profile.website || "");
      setAvatarUrl(profile.avatar || "");
    }
  }, [profile]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(updateProfileStart());

    try {
      const response = await axios.put(
        `/api/user/current`,
        { userName, bio, website, avatar: avatarUrl },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        dispatch(updateProfileSuccess(response.data));
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        dispatch(updateProfileFailure(error.response?.data?.message || "Произошла ошибка при запросе"));
      } else {
        dispatch(updateProfileFailure("Неизвестная ошибка"));
      }
    }
  };

  return (
    <>
      <Sidebar />
      <div className="container mx-auto p-4">
        {isLoading ? (
          <p>Загрузка...</p>
        ) : errorMessage ? (
          <p style={{ color: "red" }}>{errorMessage}</p>
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-4">{userId}</h1>
            <div className="shadow-lg p-4 mb-4">
              <div className="flex items-center mb-4">
                <div>
                  <CldImage
                    src={avatarUrl || "/default-avatar.png"}
                    width={168}
                    height={168}
                    alt="Avatar"
                    crop="fill"
                    quality="auto"
                    format="auto"
                  />
                </div>
                <div className="ml-4">
                  <AvatarUpload
                    userId={userId}
                    token={token}
                    onAvatarChange={setAvatarUrl}
                  />
                </div>
              </div>
            </div>

            <div className="shadow-lg p-4 mb-4">
              <h2 className="text-xl font-bold mb-4">Информация о пользователе</h2>
              <div className="mb-4">
                <strong>Имя:</strong>
                <p>{userName}</p>
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

            <div className="shadow-lg p-4 mb-4">
              <form onSubmit={handleProfileUpdate}>
                <div className="mb-4">
                  <label htmlFor="name" className="block">Имя:</label>
                  <input
                    id="name"
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
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
      <Footer />
    </>
  );
};

export default ProfileUpdate;
