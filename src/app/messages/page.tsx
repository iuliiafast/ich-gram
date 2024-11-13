"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

type Message = {
  id: number;
  content: string;
  sender: string;
};

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  // Загружаем сообщения при загрузке компонента
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get("/api/messages"); // Здесь указывается ваш API для получения сообщений
        setMessages(response.data);
      } catch (error) {
        console.error("Ошибка при загрузке сообщений:", error);
      }
    };

    fetchMessages();
  }, []);

  // Обработчик отправки нового сообщения
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const response = await axios.post("/api/messages", {
        content: newMessage,
      });
      setMessages([...messages, response.data]); // Добавляем новое сообщение в список
      setNewMessage(""); // Очищаем поле ввода
    } catch (error) {
      console.error("Ошибка при отправке сообщения:", error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Сообщения</h1>
      <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-4 h-64 overflow-y-auto">
        {messages.map((message) => (
          <div key={message.id} className="mb-2 p-2 bg-white rounded-lg shadow">
            <p className="font-bold">{message.sender}</p>
            <p>{message.content}</p>
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Напишите сообщение..."
          className="flex-1 border border-gray-300 rounded-l-lg p-2"
        />
        <button
          onClick={handleSendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600"
        >
          Отправить
        </button>
      </div>
    </div>
  );
}
