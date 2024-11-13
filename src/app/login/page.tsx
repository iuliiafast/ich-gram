"use client";
import React, { useState } from 'react';
import Container from '../../components/Container';
import LoginForm from '../../components/LoginForm';
import Link from 'next/link';
import Image from 'next/image';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <>
      <article className="flex items-center justify-center h-[81vh] w-[80vw] mx-auto gap-6">
        <div className="flex-shrink-0">
          <Image
            src="/index.svg"
            alt="background"
            width={380}
            height={583}
            priority
            className="rounded-md shadow-lg"
          />
        </div>
        <Container>
          <div className="flex flex-col items-center border rounded-lg p-8 w-full max-w-md bg-white shadow-md">
            <Image src="/logo.svg" alt="logo" width={190} height={107} priority />
            <LoginForm setIsLoading={setIsLoading} setError={setError} isLoading={isLoading} />
            {error && <p style={{ color: "red" }}>{error}</p>}
            <div className="flex items-center mt-6">
              <hr className="flex-grow border-t border-gray-300" />
              <span className="px-2 text-gray-500">OR</span>
              <hr className="flex-grow border-t border-gray-300" />
            </div>

            <Link href="/reset" className="text-blue-600 hover:underline">Forgot password?</Link>
          </div>

          <div className="flex flex-raw items-center border rounded-lg p-8 w-full max-w-md bg-white shadow-md">
            <span>Don`t have an account? <Link href="/register" className="text-blue-600 hover:underline">Sign up</Link></span>
          </div>
        </Container>
      </article>
    </>
  );
}
