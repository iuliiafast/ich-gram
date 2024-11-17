"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FollowPage, User } from "../utils/types"

const FollowPage: React.FC<FollowPage> = ({ userId }) => {
  const [followers, setFollowers] = useState<User[]>([]);  // Применяем правильный тип для followers
  const [following, setFollowing] = useState<User[]>([]);  // Применяем правильный тип для following
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        const response = await axios.get(`/api/users/${userId}/followers`);
        setFollowers(response.data);  // Здесь предполагаем, что response.data соответствует типу User[]
      } catch (err) {
        setError("Ошибка при загрузке подписчиков");
        console.error(err);
      }
    };

    const fetchFollowing = async () => {
      try {
        const response = await axios.get(`/api/users/${userId}/following`);
        setFollowing(response.data);  // Здесь предполагаем, что response.data соответствует типу User[]
      } catch (err) {
        setError("Ошибка при загрузке списка подписок");
        console.error(err);
      }
    };

    fetchFollowers();
    fetchFollowing();
  }, [userId]);

  const handleFollow = async (targetUserId: string) => {
    try {
      await axios.post(`/api/users/${userId}/follow/${targetUserId}`);
      // Вставляем в список подписок нового пользователя с полями, соответствующими интерфейсу User
      setFollowing([...following, { UserId: targetUserId, userName: `User${targetUserId}` }]);
      setError(null);
    } catch (err) {
      setError("Ошибка при подписке на пользователя");
      console.error(err);
    }
  };

  const handleUnfollow = async (targetUserId: string) => {
    try {
      await axios.delete(`/api/users/${userId}/unfollow/${targetUserId}`);
      setFollowing(following.filter((user) => user.UserId !== targetUserId));  // Применяем правильный идентификатор UserId
      setError(null);
    } catch (err) {
      setError("Ошибка при отписке от пользователя");
      console.error(err);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Подписки и Подписчики</h1>

      {/* Error message */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Followers list */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Подписчики</h2>
        {followers.map((follower) => (
          <div key={follower.UserId} className="flex justify-between items-center border-b border-gray-300 py-2">
            <span>{follower.userName}</span>
            <button
              onClick={() => handleFollow(follower.UserId)}
              className="text-blue-500 text-sm"
            >
              Подписаться
            </button>
          </div>
        ))}
      </div>

      {/* Following list */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Вы подписаны на</h2>
        {following.map((user) => (
          <div key={user.UserId} className="flex justify-between items-center border-b border-gray-300 py-2">
            <span>{user.userName}</span>
            <button
              onClick={() => handleUnfollow(user.UserId)}
              className="text-red-500 text-sm"
            >
              Отписаться
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FollowPage;
