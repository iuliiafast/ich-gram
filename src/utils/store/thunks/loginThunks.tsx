"use client";
import axios from "axios";
import Cookies from "js-cookie";
import { AppDispatch } from "../store.ts";
import { loginStart, loginSuccess, loginFailure } from "../slices/authSlice";
import $api from '../../api.ts';

export const loginUser = (login: string, password: string) => async (dispatch: AppDispatch) => {
  dispatch(loginStart());

  try {
    const response = await $api.post(`/auth/login`, { login, password });

    if (response.data?.user && response.data?.token) {

      Cookies.set("token", response.data.token, { expires: 7, sameSite: "lax", secure: false });

      dispatch(loginSuccess({
        user: response.data.user,
        token: response.data.token
      }));
      return response.data.user;
    } else {
      throw new Error("Некорректный ответ от сервера: отсутствуют данные пользователя или токен.");
    }
  } catch (error: unknown) {
    let errorMsg = "Произошла ошибка при входе.";

    if (axios.isAxiosError(error)) {
      errorMsg = error.response?.data?.message || "Ошибка от сервера.";
    } else if (error instanceof Error) {
      errorMsg = error.message || "Ошибка при настройке запроса.";
    }
    dispatch(loginFailure(errorMsg));

    throw new Error(errorMsg);
  }
};
