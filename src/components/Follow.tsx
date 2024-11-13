"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

interface User {
  _id: string;
  username: string;
}

interface FollowPageProps {
  userId: string;
}

const FollowPage: React.FC<FollowPageProps> = ({ userId }) => {
  const [followers, setFollowers] = useState<User[]>([]);
  const [following, setFollowing] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        const response = await axios.get(`/api/users/${userId}/followers`);
        setFollowers(response.data);
      } catch (err) {
        setError("Ошибка при загрузке подписчиков");
        console.error(err);
      }
    };

    const fetchFollowing = async () => {
      try {
        const response = await axios.get(`/api/users/${userId}/following`);
        setFollowing(response.data);
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
      setFollowing([...following, { _id: targetUserId, username: `User${targetUserId}` }]);
      setError(null);
    } catch (err) {
      setError("Ошибка при подписке на пользователя");
      console.error(err);
    }
  };

  const handleUnfollow = async (targetUserId: string) => {
    try {
      await axios.delete(`/api/users/${userId}/unfollow/${targetUserId}`);
      setFollowing(following.filter((user) => user._id !== targetUserId));
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
          <div key={follower._id} className="flex justify-between items-center border-b border-gray-300 py-2">
            <span>{follower.username}</span>
            <button
              onClick={() => handleFollow(follower._id)}
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
          <div key={user._id} className="flex justify-between items-center border-b border-gray-300 py-2">
            <span>{user.username}</span>
            <button
              onClick={() => handleUnfollow(user._id)}
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
