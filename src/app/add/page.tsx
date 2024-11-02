"use client";
import { useState } from "react";
import axios from "axios";

const AddPostPage = () => {
  const [image, setImage] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImage(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!image) {
      setMessage("Пожалуйста, выберите изображение.");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);
    formData.append("description", description);

    try {
      setLoading(true);
      setMessage("");
      await axios.post("/api/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("Пост успешно добавлен!");
      setImage(null);
      setDescription("");
    } catch (error) {
      console.error("Ошибка добавления поста:", error);
      setMessage("Не удалось добавить пост.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Добавить новый пост</h1>
      {message && <p className="mb-4 text-center text-green-600">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-2">Изображение:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Описание:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full p-2 border rounded"
            placeholder="Введите описание..."
          ></textarea>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full p-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? "Загрузка..." : "Добавить пост"}
        </button>
      </form>
    </div>
  );
};

export default AddPostPage;
