"use client";
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import profileReducer from './slices/profileSlice';
//import { loginUser } from './thunks/loginThunks';
//import { fetchProfile } from './thunks/profileThunks';
//import { registerUser } from './thunks/regThunks'; 


export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch; 
