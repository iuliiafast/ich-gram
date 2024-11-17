"use client";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { User } from "../../types";
import { RootState } from "../index";

// Определяем начальное состояние
interface ProfileState {
  profile: User | null;
  isLoading: boolean;
  errorMessage: string | null;
  successMessage: string | null;
}

const initialState: ProfileState = {
  profile: null,
  isLoading: false,
  errorMessage: null,
  successMessage: null,
};

// Асинхронный thunk для загрузки профиля
export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
  async (userId: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token") || "";
      const { data } = await axios.get(`/api/user/profile/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data as User;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || "Ошибка при загрузке профиля");
      } else {
        return rejectWithValue("Неизвестная ошибка при загрузке профиля");
      }
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    updateProfileStart(state) {
      state.isLoading = true;
      state.errorMessage = null;
      state.successMessage = null;
    },
    updateProfileSuccess(state, action: PayloadAction<User>) {
      state.isLoading = false;
      state.profile = action.payload;
      state.successMessage = "Профиль успешно обновлен!";
    },
    updateProfileFailure(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.errorMessage = action.payload;
    },

    clearProfile(state) {
      state.profile = null;
      state.errorMessage = null;
    },
    clearProfileMessages(state) {
      state.successMessage = null;
      state.errorMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.profile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload as string;
      });
  },
});

export const {
  updateProfileStart,
  updateProfileSuccess,
  updateProfileFailure,
  clearProfile
} = profileSlice.actions;
export const selectProfile = (state: RootState) => state.profile.profile;
export default profileSlice.reducer;
