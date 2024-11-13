"use client";
import React from 'react';
import Image from 'next/image';

const mockImages = [];

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
