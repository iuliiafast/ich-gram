"use client";
import React from 'react';
import Image from 'next/image';

interface Post {
  id: string;
  title: string;
  content: string;
  image?: string; // URL изображения, если есть
  createdAt: string;
}

interface PostFeedProps {
  posts: Post[]; // Массив постов передается как пропс
  onPostClick: (postId: string) => void; // Функция для обработки клика по посту
}

const PostFeed: React.FC<PostFeedProps> = ({ posts = [], onPostClick }) => { // Добавлена дефолтная пустая строка для posts
  if (!posts || posts.length === 0) {
    return <p>Нет доступных постов.</p>; // Вывод сообщения, если постов нет
  }
  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div
          key={post.id}
          className="bg-white p-4 rounded-lg shadow-md cursor-pointer" // Добавил курсор pointer для постов
          onClick={() => onPostClick(post.id)} // Обработчик клика по посту
        >
          {post.image && (
            <Image
              src={post.image}
              alt="Post image"
              width={800} // Указываем ширину изображения
              height={600} // Указываем высоту изображения
              className="w-full h-auto rounded mb-2"
              layout="responsive" // Адаптивное изображение
              objectFit="cover" // Обрезка изображения
            />
          )}
          <h2 className="text-lg font-bold">{post.title}</h2>
          <p className="text-sm text-gray-600">{new Date(post.createdAt).toLocaleDateString()}</p>
          <p className="mt-2 text-gray-800">{post.content}</p>
        </div>
      ))}
    </div>
  );
};

export default PostFeed;
