"use client";
import React, { useState } from "react";
import axios from "axios";

type SearchResult = {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
};

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get("/api/search", {
        params: { q: query },
      });
      setResults(response.data);
    } catch (error) {
      console.error("Ошибка при поиске:", error);
      setError("Ошибка при выполнении поиска. Попробуйте еще раз.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Поиск</h1>
      <div className="mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Введите запрос для поиска..."
          className="border border-gray-300 rounded-l-lg p-2 w-3/4"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600"
        >
          Поиск
        </button>
      </div>

      {loading && <p>Загрузка...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {results.map((result) => (
          <div key={result.id} className="border rounded-lg shadow p-4">
            <img src={result.imageUrl} alt={result.name} className="w-full h-48 object-cover rounded mb-2" />
            <h2 className="font-bold text-lg">{result.name}</h2>
            <p>{result.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
