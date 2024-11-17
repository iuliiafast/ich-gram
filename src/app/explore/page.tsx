"use client";
import React from 'react';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import Image from 'next/image';

const imageUrls = [
  `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/random/v1683188475/sample1.jpg`,
  `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/random/v1683188475/sample2.jpg`,
  `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/random/v1683188475/sample3.jpg`,
  `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/random/v1683188475/sample4.jpg`,
  `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/random/v1683188475/sample5.jpg`,
  `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/random/v1683188475/sample6.jpg`,
  `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/random/v1683188475/sample7.jpg`,
  `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/random/v1683188475/sample8.jpg`,
  `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/random/v1683188475/sample9.jpg`,
  `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/random/v1683188475/sample10.jpg`,
];

const ExplorePage = () => {
  return (
    <>
      <main>
        <Sidebar />
        <div className="grid grid-cols-3 gap-4">
          {/* Первая колонка с тремя ячейками */}
          <div className="grid grid-rows-3 gap-4">
            <div className="bg-blue-400 h-full">
              <Image src=
                {imageUrls[0]} alt=
                "Random Image 1"
                width={317}
                height={317}
                className="w-full h-full object-cover" />
            </div>
            <div className="bg-blue-400 h-full">
              <Image src=
                {imageUrls[1]} alt=
                "Random Image 2"
                width={317}
                height={317}
                className="w-full h-full object-cover" />
            </div>
            <div className="bg-blue-400 h-full col-span-2">
              <Image src=
                {imageUrls[2]} alt="Random Image 3"
                width={317}
                height={636}
                className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Вторая колонка с четырьмя одинаковыми ячейками */}
          <div className="grid grid-rows-4 gap-4">
            <div className="bg-green-400 h-full">
              <Image src={imageUrls[3]} alt="Random Image 4"
                width={317}
                height={317}
                className="w-full h-full object-cover" />
            </div>
            <div className="bg-green-400 h-full">
              <Image src={imageUrls[4]} alt="Random Image 5"
                width={317}
                height={317}
                className="w-full h-full object-cover" />
            </div>
            <div className="bg-green-400 h-full">
              <Image src={imageUrls[5]} alt="Random Image 6"
                width={317}
                height={317}
                className="w-full h-full object-cover" />
            </div>
            <div className="bg-green-400 h-full">
              <Image src={imageUrls[6]} alt="Random Image 7"
                width={317}
                height={317}
                className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Третья колонка с тремя ячейками */}
          <div className="grid grid-rows-3 gap-4">
            <div className="bg-red-400 h-full">
              <Image src={imageUrls[7]} alt="Random Image 8"
                width={317}
                height={636}
                className="w-full h-full object-cover" />
            </div>
            <div className="bg-red-400 h-full">
              <Image src={imageUrls[8]} alt="Random Image 9"
                width={317}
                height={317}
                className="w-full h-full object-cover" />
            </div>
            <div className="bg-red-400 h-full row-span-2">
              <Image src={imageUrls[9]} alt="Random Image 10"
                width={317}
                height={317}
                className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ExplorePage;
