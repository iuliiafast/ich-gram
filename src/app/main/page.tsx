"use client";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../utils/store/store";
import Sidebar from "../../components/Sidebar";
import Footer from "../../components/Footer";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { fetchProfile } from "../../utils/store/slices/profileSlice";

const MainPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { profile } = useSelector((state: RootState) => state.profile);
  useEffect(() => {
    if (userId, token) {
      dispatch(fetchProfile(userId, token));
    }
  }, [dispatch, userId, token]);
  const handleProfileClick = () => {
    if (userId && userId !== '')
      console.log(`Navigating to profile for userId: ${userId}`);
    router.push(`/profile/${userId}`);
  } else {
    console.log("user не найден");
}
  }

const imageUrls = [
  `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/random/v1683188475/sample1.jpg`,
  `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/random/v1683188475/sample2.jpg`,
  `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/random/v1683188475/sample3.jpg`,
  `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/random/v1683188475/sample4.jpg`,
];

return (
  <>
    <div>
      <div>
        <Sidebar />
        <button
          onClick={handleProfileClick}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Перейти в профиль
        </button>
      </div>
      <div className="grid grid-cols-2 grid-rows-2 gap-4 mt-4">
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

export default MainPage;
