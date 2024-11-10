"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push('/login');
  }, [router]);
  return null;
}

/*Серверный редирект с getServerSideProps
export async function getServerSideProps(context) {
  return {
    redirect: {
      destination: '/login',
      permanent: false,
    },
  };
}

export default function Home() {
  return null;
}*/