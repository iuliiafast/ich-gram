"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Sidebar from "../../components/Sidebar";
import Footer from "../../components/Footer";
import Image from 'next/image';
import ProfileButton from '../../components/ProfileButton';

const MainPage = () => {

  const [userId, setUserId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setUserId("some-valid-user-id");
    setToken("some-valid-token");
  }, []);

  if (!userId || !token) {
    return <div>Loading...</div>;

  }
  const imageUrls = [
    `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/random/v1683188475/sample1.jpg`,
    `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/random/v1683188475/sample2.jpg`,
    `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/random/v1683188475/sample3.jpg`,
    `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/random/v1683188475/sample4.jpg`
  ];

  return (
    <>
      <div className="">
        <Sidebar />
        <div>
          <ProfileButton userId={userId} token={token} />
        </div>

        <div className="grid grid-cols-2 grid-rows-2 gap-4 mt-4">
          {/* Вторая колонка с четырьмя изображениями */}
          {imageUrls.map((url, index) => (
            <div key={index} className="bg-green-400 h-full">
              <Image
                src={url}
                alt={`Random Image ${index + 1}`}
                width={317}
                height={317}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default MainPage;