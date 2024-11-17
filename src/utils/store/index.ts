// store/index.ts
import { configureStore } from '@reduxjs/toolkit';

import authReducer from './slices/authSlice'; // Слайс для авторизации
import profileReducer from './slices/profileSlice'; // Слайс для профиля

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer, // Добавляем слайс для профиля
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export type RootState = ReturnType<typeof store.getState>; // Тип для состояния всего приложения

export type AppDispatch = typeof store.dispatch; // Тип для dispatch
