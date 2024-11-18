"use client";
import axios from "axios";
import { AppDispatch } from "../store";
import { registerStart, registerSuccess, registerFailure } from "../slices/authSlice";
import Cookies from "js-cookie";
import { User, UserRegistration } from "../../types";

export const registerUser = (userObject: UserRegistration) => async (dispatch: AppDispatch) => {
  try {
    dispatch(registerStart());
    const response = await axios.post(`http://localhost:3000/api/auth/register`, userObject);
    if (response.data?.token && response.data?.user) {
      Cookies.set("token", response.data.token, { expires: 7, sameSite: "lax", secure: false });
      dispatch(registerSuccess({ user: response.data.user, token: response.data.token }));
      return response.data.user as User;
    } else {
      throw new Error("Токен отсутствует в ответе сервера.");
    }
  } catch (error: unknown) {
    let errorMsg = "Произошла ошибка при регистрации.";
    if (axios.isAxiosError(error)) {
      errorMsg = error.response?.data?.message || "Ошибка от сервера.";
    } else if (error instanceof Error) {
      errorMsg = error.message || "Ошибка при настройке запроса.";
    }
    dispatch(registerFailure(errorMsg));
    throw new Error(errorMsg);
  }
};
