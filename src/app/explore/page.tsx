// Import necessary libraries and components
import React from 'react';
import Image from 'next/image';

const mockImages = [
  '/images/img1.jpg',
  '/images/img2.jpg',
  '/images/img3.jpg',
  '/images/img4.jpg',
  '/images/img5.jpg',
  '/images/img6.jpg',
  // Add more image paths here or fetch them from an API
];

const ExplorePage = () => {
  return (
    <div className="p-4 max-w-screen-xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Explore</h1>

      {/* Image Grid */}
      <div className="grid grid-cols-3 gap-2 md:gap-4">
        {mockImages.map((src, index) => (
          <div key={index} className="relative aspect-square">
            <Image
              src={src}
              alt={`Explore image ${index + 1}`}
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExplorePage;
