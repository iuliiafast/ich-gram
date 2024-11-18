"use client";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Profile, ProfileState } from "../../types";
import { RootState } from "../store";
import axios from "axios";

export const fetchProfile = createAsyncThunk<
  Profile, // Тип данных, которые мы получаем от API
  string,  // Тип аргумента, который мы передаем (userId)
  { rejectValue: string }  // Тип для ошибки
>
  (
    `profile/fetchProfile`,
    async (userId, { rejectWithValue }) => {
      try {
        const response = await axios.get(`/api/profile/${userId}`);
        return response.data;
      } catch (error) {
        // В случае ошибки возвращаем сообщение об ошибке
        if (error instanceof Error) {
          return rejectWithValue(error.message);
        }
        return rejectWithValue("Неизвестная ошибка при загрузке профиля");
      }
    }
  );

const initialState: ProfileState = {
  profile: null,
  isLoading: false,
  errorMessage: null,
  successMessage: null,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    updateProfileStart(state) {
      state.isLoading = true;
      state.errorMessage = null;
      state.successMessage = null;
    },
    updateProfileSuccess(state, action: PayloadAction<Profile>) {
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
      .addCase(fetchProfile.fulfilled, (state, action: PayloadAction<Profile>) => {
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
  clearProfile,
  clearProfileMessages
} = profileSlice.actions;
export const selectProfile = (state: RootState) => state.profile.profile;
export default profileSlice.reducer;
