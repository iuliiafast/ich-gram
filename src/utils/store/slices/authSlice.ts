"use client";
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, UserObject } from '../../types';

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
    registerSuccess: (state, action: PayloadAction<{ user: UserObject; token: string }>) => {
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
  },
});

export const { registerStart, registerSuccess, registerFailure, clearError } = authSlice.actions;
export default authSlice.reducer;
