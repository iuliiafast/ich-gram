"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from 'next/image';
import Container from '../../components/Container';
import Link from 'next/link';

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await axios.post("/api/login", {
        username,
        password,
      });

      console.log(response.data.message);
      router.push('/'); // Перенаправление на главную страницу после успешного входа
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setErrorMessage(error.response.data.message || 'Ошибка входа'); // Установка сообщения об ошибке
        console.error('Ошибка входа:', error.response.data.message);
      } else {
        setErrorMessage('Ошибка входа'); // Обработка других ошибок
        console.error('Ошибка входа');
      }
    }
  };

  return (
    <>
      <article className="flex items-center justify-center h-[81vh] w-[80vw] mx-auto gap-6">
        <div className="flex-shrink-0">
          <Image
            src="/images/background.svg"
            alt="background"
            width={380}
            height={581}
            priority
            className="rounded-md shadow-lg"
          />
        </div>
        <Container>
          <div className="flex flex-col items-center border rounded-lg p-8 w-full max-w-md bg-white shadow-md">
            <Image
              src="/images/logo.svg"
              alt="logo"
              width={190}
              height={107}
              priority
            />
            <form onSubmit={handleLogin} className="w-full mt-6 space-y-4">
              <div>
                <input
                  type="text"
                  required
                  autoComplete="username"
                  placeholder="Введите имя пользователя"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="p-2 border rounded w-full"
                />
              </div>
              <div>
                <input
                  type="password"
                  required
                  autoComplete="current-password"
                  placeholder="Введите пароль"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="p-2 border rounded w-full"
                />
              </div>
              {errorMessage && (
                <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
              )}
              <button
                type="submit"
                className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Log in
              </button>
              <div className="flex items-center mt-6">
                <hr className="flex-grow border-t border-gray-300" />
                <span className="px-2 text-gray-500">OR</span>
                <hr className="flex-grow border-gray-300" />
              </div>
              <Link href="/reset" className="text-blue-600 hover:underline">Forgot password?</Link>
            </form>
          </div>
        </Container>
      </article>
      <article className="flex items-center justify-center h-[81vh] w-[80vw] mx-auto gap-6">
        <span>Don't have an account? <Link href="/register" className="text-blue-600 hover:underline">Sign up</Link></span>
      </article>
    </>
  );
}
