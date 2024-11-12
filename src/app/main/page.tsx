"use client";
import React from 'react';
import Sidebar from '../../components/Sidebar';
import PostFeed from '../../components/PostFeed';
import Footer from '../../components/Footer';

const Main = () => {
  const posts = [
    { id: '1', title: 'Пост 1', content: 'Контент поста 1', createdAt: '2024-11-12T12:00:00Z' },
    { id: '2', title: 'Пост 2', content: 'Контент поста 2', createdAt: '2024-11-11T12:00:00Z' },
    { id: '3', title: 'Пост 3', content: 'Контент поста 3', createdAt: '2024-11-10T12:00:00Z' },
  ];

  // Функция для обработки кликов на посты
  const handlePostClick = (postId: string) => {
    console.log('Post clicked:', postId);
  };

  return (
    <>
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <PostFeed posts={posts} onPostClick={handlePostClick} />
        <div className="flex-grow p-6"> {/* Добавим класс для отступов */}
          {/* Можно добавить дополнительный контент, если нужно */}
        </div>
      </div>
      <div>
        <Footer />
      </div>
    </>
  );
};

export default Main;
