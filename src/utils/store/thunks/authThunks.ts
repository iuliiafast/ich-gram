import axios from 'axios';
import { AppDispatch } from '../index';
import { registerStart, registerSuccess, registerFailure } from '../slices/authSlice';
import Cookies from 'js-cookie';
import { UserObject } from '../../types';

export const registerUser = (userObject: UserObject) => async (dispatch: AppDispatch) => {
  try {
    dispatch(registerStart());
    const response = await axios.post(`http://localhost:3000/api/auth/register`, userObject);
    if (response.data?.token) {
      Cookies.set("token", response.data.token, { expires: 7, sameSite: "lax", secure: false });
      dispatch(registerSuccess({ user: response.data.user, token: response.data.token }));
    }
  } catch (error: unknown) {
    let errorMsg = "Произошла ошибка при регистрации.";
    if (axios.isAxiosError(error)) {
      errorMsg = error.response?.data?.message || "Ошибка от сервера.";
    } else if (error instanceof Error) {
      errorMsg = error.message || "Ошибка при настройке запроса.";
    }
    dispatch(registerFailure(errorMsg));
  }
};
