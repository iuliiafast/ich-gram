"use client";
import { ImageForm } from './ImageForm';
import { useState } from "react";
import React from 'react';

const UploadPage = () => {
  const [image, setImage] = useState<File | null>(null);

  return (
    <div>
      <h1>Загрузите изображение</h1>
      <ImageForm setImage={setImage} />
      {image && <p>Загружено изображение: {image.name}</p>}
    </div>
  );
};


export default UploadPage;
