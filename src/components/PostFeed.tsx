"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Post } from '../utils/types';
import PostComponent from '../components/PostComponent';

const PostFeed = () => {
  const [posts, setPosts] = useState<Post[]>([]);  // Состояние для постов
  const [loading, setLoading] = useState(false);  // Состояние загрузки
  const [error, setError] = useState<string | null>(null);  // Состояние ошибки
  const [isEmptyFeed, setIsEmptyFeed] = useState(false);  // Состояние, что лента пуста

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      setIsEmptyFeed(false);

      try {
        const response = await axios.get("http: localhost: 3000/api/post");
        const postsData: Post[] = response.data;

        if (!postsData || postsData.length === 0) {
          setIsEmptyFeed(true);
        } else {
          setPosts(postsData);
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
          <PostComponent key={post.user_id.toString()} post={post} />
        ))}

      </ul>
    </div>
  );
};

export default PostFeed;
