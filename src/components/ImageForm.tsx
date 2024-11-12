"use client";
import { useState } from "react";
import { $api } from "../utils/api";
import axios from 'axios';
import React from "react";

type ImageFormProps = {
  setImage: React.Dispatch<React.SetStateAction<File | null>>;
};

export const ImageForm = ({ setImage }: ImageFormProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [filePath, setFilePath] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setError("Пожалуйста, выберите изображение");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await $api.post("/post", formData); // Отправка данных на сервер
      setFilePath(response.data.url); // Устанавливаем путь к загруженному изображению
      setImage(file); // Передаем файл в родительский компонент через setImage
      setError(""); // Очищаем ошибку
    } catch (err: unknown) {
      // Проверка типа ошибки: если это ошибка от Axios
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Ошибка при загрузке изображения");
      } else if (err instanceof Error) {
        // Если ошибка - стандартная ошибка JavaScript
        setError(err.message || "Произошла неизвестная ошибка");
      } else {
        // Для других типов ошибок (если они вообще могут быть)
        setError("Неизвестная ошибка при загрузке изображения");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        required
        type="file"
        onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} // Устанавливаем выбранный файл
        accept="image/*"
      />
      <button type="submit">Отправить картинку</button>

      {/* Показываем ошибку, если она возникла */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Показываем путь к загруженному изображению */}
      {filePath && <span>URL картинки: {filePath}</span>}
    </form>
  );
};
