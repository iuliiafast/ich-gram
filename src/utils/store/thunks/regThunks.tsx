"use client";
import { AppDispatch } from "../store";
import { registerStart, registerSuccess, registerFailure } from "../slices/authSlice";
import Cookies from "js-cookie";
import $api from "../../api";
import { UserRegistration, RegisterResponse } from "../../types";

export const registerUser = (userObject: UserRegistration) => async (dispatch: AppDispatch): Promise<RegisterResponse> => {
  try {
    dispatch(registerStart());
    const response = await $api.post(`/auth/register`, userObject);
    if (response.data?.token && response.data?.user) {
      Cookies.set("token", response.data.token, { expires: 7, sameSite: "lax", secure: false });
      dispatch(registerSuccess({ user: response.data.user, token: response.data.token }));
      return { user: response.data.user, token: response.data.token };
    } else {
      throw new Error("Токен отсутствует в ответе сервера.");
    }
  } catch (error: unknown) {
    let errorMsg = "Произошла ошибка при регистрации.";
    if (error instanceof Error && error.message) {
      errorMsg = error.message;
    }
    dispatch(registerFailure(errorMsg));
    throw new Error(errorMsg);
  }
};
