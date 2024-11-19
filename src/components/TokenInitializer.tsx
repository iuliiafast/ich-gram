"use client";
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { loadTokenFromCookies } from "../utils/authHelpers";
import { useDispatch } from "react-redux";

const TokenInitializer = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    loadTokenFromCookies(dispatch);
    const token = Cookies.get("token");

    if (token) {
      console.log("Токен из cookies:", token);
      if (pathname === '/login' || pathname === '/register') {
        router.push('/dashboard');
      }
    } else {
      console.log("Токен не найден в cookies");
      if (pathname !== '/login' && pathname !== '/register') {
        router.push('/login');
      }
    }
  }, [dispatch, pathname, router,]);

  return null;
};

export default TokenInitializer;
