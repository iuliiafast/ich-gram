"use client";
import { useEffect, useState } from "react";
import axios from "axios";

type UserProfile = {
  username: string;
  bio: string;
  avatarUrl: string;
  posts: Array<{ id: number; imageUrl: string; description: string }>;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/profile"); // Запрос к серверу для получения профиля пользователя
        setProfile(response.data);
      } catch (error) {
        console.error("Ошибка загрузки профиля:", error);
        setError("Не удалось загрузить профиль.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <p className="text-center text-gray-500">Загрузка...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="flex items-center mb-8">
        <img
          src={profile?.avatarUrl}
          alt="User Avatar"
          className="w-24 h-24 rounded-full mr-4"
        />
        <div>
          <h1 className="text-2xl font-bold">{profile?.username}</h1>
          <p className="text-gray-600">{profile?.bio || "Биография отсутствует"}</p>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-4">Мои посты</h2>
      <div className="grid grid-cols-2 gap-4">
        {profile?.posts.length ? (
          profile.posts.map((post) => (
            <div key={post.id} className="border rounded-lg overflow-hidden shadow">
              <img
                src={post.imageUrl}
                alt={post.description}
                className="w-full h-40 object-cover"
              />
              <div className="p-2">
                <p className="text-sm text-gray-800">{post.description}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">Посты отсутствуют.</p>
        )}
      </div>
    </div>
  );
}
