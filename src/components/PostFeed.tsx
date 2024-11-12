"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Post {
  id: string;
  content: string;
  author: string;
  timestamp: string;
}

const PostFeed = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("/api/posts");
        setPosts(response.data);
      } catch (error) {
        setError("Не удалось загрузить посты. Попробуйте позже.");
        console.error(error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Лента постов</h1>
      {error && <p className="text-red-500">{error}</p>}
      {posts.map((post) => (
        <div key={post.id} className="border-b border-gray-300 py-4">
          <p className="font-semibold">{post.author}</p>
          <p>{post.content}</p>
          <p className="text-gray-400 text-sm">{new Date(post.timestamp).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
};

export default PostFeed;
