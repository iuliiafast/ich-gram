"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { $api } from '../app/api/register';

export const RegisterForm = () => {
  const [userObject, setUserObject] = useState({
    email: "",
    password: "",
    username: "",
    full_name: "",
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    try {
      const response = await $api.post("/auth/register", userObject);
      console.log(response.data.message);
      router.push("/login");
    } catch (error) {
      const errorResponse = error.response?.data;
      setErrorMessage(errorResponse?.message || "Ошибка регистрации");
      console.error("Ошибка регистрации:", errorResponse?.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <input
          onChange={(e) => setUserObject({ ...userObject, email: e.target.value })}
          type="email"
          placeholder="Email"
          required
          className="border border-gray-300 p-2 rounded w-full"
        />
      </div>
      <div>
        <input
          onChange={(e) => setUserObject({ ...userObject, password: e.target.value })}
          type="password"
          placeholder="Password"
          required
          className="border border-gray-300 p-2 rounded w-full"
        />
      </div>
      <div>
        <input
          onChange={(e) => setUserObject({ ...userObject, username: e.target.value })}
          type="text"
          placeholder="Username"
          required
          className="border border-gray-300 p-2 rounded w-full"
        />
      </div>
      <div>
        <input
          onChange={(e) => setUserObject({ ...userObject, full_name: e.target.value })}
          type="text"
          placeholder="Full Name"
          required
          className="border border-gray-300 p-2 rounded w-full"
        />
      </div>
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">Register</button>
    </form>
  );
};
