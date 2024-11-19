import { AppDispatch } from '../store';
import { updateProfileStart, updateProfileSuccess, updateProfileFailure } from '../slices/profileSlice';
import $api from '../../api';

export const fetchProfile = (userId: string) => async (dispatch: AppDispatch) => {
  try {
    dispatch(updateProfileStart());
    const { data } = await $api.get(`/api/user/profile/${userId}`);
    dispatch(updateProfileSuccess(data));
  } catch (error) {
    dispatch(updateProfileFailure(error.message || "Ошибка при загрузке профиля"));
  }
};
