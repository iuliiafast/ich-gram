"use client";
import React from 'react';
import Sidebar from '../../components/Sidebar';
import PostFeed from '../../components/PostFeed';
import Footer from '../../components/Footer';

const Main = () => {

  return (
    <>
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-grow p-6"> {/* Добавим класс для отступов */}
          {/* Можно добавить дополнительный контент, если нужно */}
        </div>
        <PostFeed />
      </div>
      <div>
        <Footer />
      </div>
    </>
  );
};

export default Main;
