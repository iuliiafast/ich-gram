/*"use client";
import React, { useState, useEffect } from "react";
import $api from "../../utils/api";
import AvatarUpload from "../../components/AvatarUpload";
import Sidebar from "../../components/Sidebar";
import Footer from "../../components/Footer";
import CldImage from "../../components/CldImage";
import { RootState } from "../../utils/store/store";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile, updateProfileSuccess, updateProfileFailure } from "../../utils/store/slices/profileSlice";
import { ProfileUpdates }, updateProfile from "../../utils/types";

const ProfileEdit = () => {
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

    const profileUpdates: Profile = {
      userName,
      bio,
      website,
      avatar: avatarUrl,
    };
    const dispatch = useDispatch();
    try {
      dispatch(updateProfile());
      const updatedProfile = await fakeApiUpdate(profileUpdates);
      dispatch(updateProfileSuccess(updatedProfile));
      console.log("Профиль обновлен успешно!");
    } catch (error) {
      dispatch(updateProfileFailure("Ошибка при обновлении профиля"));
      console.error("Ошибка при обновлении профиля:", error);
    }
  };
  
  // Пример асинхронной функции для обновления профиля
  const fakeApiUpdate = (profileUpdates: Profile): Promise<Profile> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.5) {
          resolve(profileUpdates); // Если "удачно"
        } else {
          reject("Ошибка на сервере"); // Если ошибка
        }
      }, 1000);
    });
  };
  return (
    <form onSubmit={handleProfileUpdate}>
      <div>
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Имя пользователя"
        />
      </div>
      <div>
        <input
          type="text"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="О себе"
        />
      </div>
      <div>
        <input
          type="text"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          placeholder="Вебсайт"
        />
      </div>
      <div>
        <input
          type="text"
          value={avatarUrl}
          onChange={(e) => setAvatarUrl(e.target.value)}
          placeholder="URL аватара"
        />
      </div>
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Обновление..." : "Обновить профиль"}
      </button>

      {errorMessage && <div className="error">{errorMessage}</div>}
      {successMessage && <div className="success">{successMessage}</div>}
    </form>
  );
};

export default ProfileEdit;
-------------------------------------------------------------------------
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

export default ProfileUpdate;*/
