"use client";
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User } from '../../types';

const initialState: AuthState = {
  user: null, // Используем объект пользователя
  token: null, // Токен авторизации
  errorMessage: null, // Ошибки авторизации
  isLoading: false, // Состояние загрузки
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
      state.user = action.payload.user; // Присваиваем объект пользователя
      state.token = action.payload.token; // Присваиваем токен
      state.errorMessage = null;
    },
    registerFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.errorMessage = action.payload; // Присваиваем сообщение об ошибке
    },
    clearError: (state) => {
      state.errorMessage = null; // Очищаем ошибки
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload; // Устанавливаем объект пользователя
    },
    clearUser: (state) => {
      state.user = null; // Сбрасываем пользователя
      state.token = null; // Сбрасываем токен
    },
  },
});

// Экспортируем экшены и редьюсер
export const {
  registerStart,
  registerSuccess,
  registerFailure,
  clearError,
  setUser,
  clearUser,
} = authSlice.actions;

export default authSlice.reducer;
