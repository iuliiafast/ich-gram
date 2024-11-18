"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Post } from '../utils/types';
import PostComponent from '../components/PostComponent';

const PostFeed: React.FC<PostFeed> = ({ userId }) => {
  const [posts, setPosts] = useState<Post[]>([]);  // Состояние для постов
  const [loading, setLoading] = useState(false);  // Состояние загрузки
  const [error, setError] = useState<string | null>(null);  // Состояние ошибки
  const [hasFetchedEmptyFeed, setHasFetchedEmptyFeed] = useState(false);  // Проверка на пустой запрос
  const [isEmptyFeed, setIsEmptyFeed] = useState(false);  // Состояние пустого фида

  useEffect(() => {
    const fetchPosts = async () => {
      if (hasFetchedEmptyFeed) return;

      setLoading(true);
      setError(null);

      try {
        const response = await axios.get("/api/post");
        const postsData: Post[] = response.data;

        if (Array.isArray(postsData) && postsData.length === 0) {
          setIsEmptyFeed(true);
          setHasFetchedEmptyFeed(true); // Устанавливаем флаг, чтобы остановить повторные запросы
        } else {
          setPosts(postsData);
          setIsEmptyFeed(false);
        }
      } catch (error) {
        setError("Не удалось загрузить посты. Попробуйте позже.");
        console.error("Ошибка при загрузке постов:", error);

        if (axios.isAxiosError(error)) {
          if (error.response) {
            // Сервер вернул ошибку
            console.error("Ошибка Axios с ответом:", error.response.data || error.response.status);
            if (error.response.status === 500) {
              setError("Ошибка сервера. Попробуйте позже.");
            } else if (error.response.status === 404) {
              setError("Посты не найдены.");
            }
          } else if (error.request) {
            // Ошибка при отправке запроса (например, проблемы с сетью)
            console.error("Ошибка при отправке запроса:", error.request);
            setError("Ошибка сети. Проверьте подключение к интернету.");
          } else {
            // Ошибка в настройке запроса
            console.error("Ошибка Axios (неизвестная ошибка):", error.message);
            setError("Произошла неизвестная ошибка.");
          }
        } else {
          // Неизвестная ошибка (не связана с Axios)
          console.error("Неизвестная ошибка:", error);
          setError("Произошла неизвестная ошибка.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {isEmptyFeed && <p>No posts available.</p>}  {/* Если лента пуста */}

      <ul>
        {posts.map((post) => (  // Правильный синтаксис стрелочной функции
          <PostComponent key={userId} post={post} />
        ))}
      </ul>
    </div>
  );
};

export default PostFeed;
