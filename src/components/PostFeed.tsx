"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Post } from "../utils/types";

/*interface Post {
  id: string;
  content: string;
  author: string;
  timestamp: string;
}

const PostFeed: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isEmptyFeed, setIsEmptyFeed] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchPosts = async (callback) => {
      setLoading(true);
      setError(null);
      setIsEmptyFeed(false);

      try {
        const response = await axios.get("/api/post");
        const postsData = response.data.posts;

        if (!postsData || postsData.length === 0) {
          setIsEmptyFeed(true);
        } else {
          setPosts(postsData);
          setIsEmptyFeed(false);
        }
      } catch (error) {
        setError("Не удалось загрузить посты. Попробуйте позже.");
        console.error("Ошибка при загрузке постов:", error);

        if (axios.isAxiosError(error)) {
          console.error("Ошибка Axios:", error.response || error.message);
        } else {
          console.error("Неизвестная ошибка:", error.message);
        }
      } finally {
        setLoading(false);
        if (callback) callback();
      }
    };

    fetchPosts(() => {
      console.log("Posts have been fetched and UI updated.");
    });
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Лента постов</h1>
      {loading && <p className="text-blue-500">Загрузка...</p>}
      {isEmptyFeed && <p className="text-gray-500">Нет постов, напишите первый пост.</p>}
      {error && <p className="text-red-500">{error}</p>}
      {posts.map((post) => (
        <PostItem key={post.id} post={post} />
      ))}
    </div>
  );
};

const PostItem: React.FC<{ post: Post }> = ({ post }) => (
  <div className="border-b border-gray-300 py-4">
    <p className="font-semibold">{post.author}</p>
    <p>{post.content}</p>
    <p className="text-gray-400 text-sm">{new Date(post.timestamp).toLocaleString()}</p>
  </div>
);

export default PostFeed;*/

const PostFeed = () => {
  const [posts, setPosts] = useState<Post[]>([]);  // Состояние для постов
  const [loading, setLoading] = useState(false);  // Состояние загрузки
  const [error, setError] = useState<string | null>(null);  // Состояние ошибки
  const [isEmptyFeed, setIsEmptyFeed] = useState(false);  // Состояние, что лента пуста

  useEffect(() => {
    const fetchPosts = async (callback) => {
      setLoading(true);  // Начинаем загрузку
      setError(null);  // Сбрасываем ошибку
      setIsEmptyFeed(false);  // Сбрасываем флаг пустой ленты

      try {
        const response = await axios.get("/api/post");
        const postsData: Post[] = response.data;    // Получаем посты из ответа

        // Проверяем, если постов нет или они пустые
        if (!postsData || postsData.length === 0) {
          setIsEmptyFeed(true);  // Если постов нет, то показываем, что лента пуста
        } else {
          setPosts(postsData);  // Если посты есть, сохраняем их в состояние
          setIsEmptyFeed(false);  // Лента не пуста
        }
      } catch (error) {
        // Если произошла ошибка при запросе, показываем сообщение
        setError("Не удалось загрузить посты. Попробуйте позже.");
        console.error("Ошибка при загрузке постов:", error);

        if (axios.isAxiosError(error)) {
          console.error("Ошибка Axios:", error.response || error.message);
        } else {
          console.error("Неизвестная ошибка:", error.message);
        }
      } finally {
        setLoading(false);  // Завершаем загрузку
        // Если передан коллбек, вызываем его
        if (callback) {
          callback();
        }
      }
    };

    // Вызываем функцию для загрузки постов
    fetchPosts(() => {
      console.log("Посты загружены и UI обновлен.");
    });
  }, []);  // Эффект сработает только один раз при монтировании компонента

  return (
    <div>
      {loading && <p>Loading...</p>}  {/* Показываем индикатор загрузки */}
      {error && <p>{error}</p>}  {/* Показываем ошибку, если она есть */}
      {isEmptyFeed && <p>No posts available.</p>}  {/* Если лента пуста */}
      <ul>
        {posts.map(post => (
          <li key={post.user_id.toString()}> {/* Используем user_id как уникальный ключ */}
            <h3>{post.user_name}</h3>  {/* Имя пользователя */}
            <p>{post.caption}</p>  {/* Подпись поста */}
            <img src={post.image_url} alt={post.caption} />
            {/* Изображение поста */}
            <div>
              <span>Likes: {post.likes_count}</span>
              <span>Comments: {post.comments_count}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PostFeed;

