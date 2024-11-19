"use client";
import React from "react";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import Image from "next/image";

const imageUrls: string[] = [
  "https://res.cloudinary.com/ich-gram/image/upload/v1731805299/a6eb7e5c132e24d6394fffa64ba52f3901806a60_j5l3pa.jpg",
  "https://res.cloudinary.com/ich-gram/image/upload/v1731804913/de06720f039f41496460e048a1fb772d5f3df386_adztec.jpg",
  "https://res.cloudinary.com/ich-gram/image/upload/v1731804771/9c23eb8b00daef4f590546d50e244b3916784ba5_hbrn0q.jpg",
  "https://res.cloudinary.com/ich-gram/image/upload/v1731804732/5792af3d9a954caba93b06fd0c5092427b304eb9_s26j2o.jpg",
];

const MainPage: React.FC = () => {
  return (
    <>
      <div>
        <Sidebar />

        <div className="grid grid-cols-2 grid-rows-2 gap-4 mt-4">
          {/* Отображаем все изображения, выбирая случайные для каждой ячейки */}
          {imageUrls.map((imageUrl, index) => (
            <Image
              key={index}
              src={imageUrl}
              alt={`Random Image ${index + 1}`}
              width={317}
              height={317}
              className="w-full h-full object-cover"
            />
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MainPage;
