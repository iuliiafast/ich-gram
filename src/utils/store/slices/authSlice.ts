"use client";
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, AuthState } from '../../types';
import $api from '../../api';
import Cookies from 'js-cookie';
import { AppDispatch } from '../store';

const initialState: AuthState = {
  user: null,
  token: null,
  errorMessage: null,
  isLoading: false,
};
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    registerStart: (state) => {
      state.isLoading = true;
      state.errorMessage = null;
    },
    registerSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.isLoading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.errorMessage = null;
    },
    registerFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.errorMessage = action.payload;
    },
    clearError: (state) => {
      state.errorMessage = null;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
      state.token = null;
    },
    loginStart: (state) => {
      state.isLoading = true;
      state.errorMessage = null;
    },
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.isLoading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.errorMessage = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.errorMessage = action.payload;
    },
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
    },
    clearToken(state) {
      state.token = null;
    },
  },
});
export const {
  registerStart,
  registerSuccess,
  registerFailure,
  clearError,
  setUser,
  clearUser,
  loginStart,
  loginSuccess,
  loginFailure,
  setToken,
  clearToken
} = authSlice.actions;
export default authSlice.reducer;
export const loginUser = (login: string, password: string) => async (dispatch: AppDispatch) => {
  dispatch(loginStart());
  try {
    const response = await $api.post(`/auth/login`, { login, password });
    dispatch(loginSuccess({
      user: response.data.user,
      token: response.data.token
    }));
    Cookies.set('token', response.data.token);
  } catch (error: unknown) {
    if (error instanceof Error) {
      // Если это ошибка, выводим ее сообщение
      dispatch(loginFailure(error.message || 'Ошибка при логине.'));
    } else {
      dispatch(loginFailure('Ошибка при логине.'));
    }
  }
};