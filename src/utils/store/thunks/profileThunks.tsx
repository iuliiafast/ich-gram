import { AppDispatch } from '../index'; // импортируем тип для dispatch
import { updateProfileStart, updateProfileSuccess, updateProfileFailure } from '../slices/profileSlice';
import axios from 'axios';
import Cookies from 'js-cookie';

// Пример функции для загрузки профиля с диспатчем экшенов
export const fetchProfile = (userId: string) => async (dispatch: AppDispatch) => {
  try {
    // Уведомляем Redux, что процесс загрузки начался
    dispatch(updateProfileStart());

    // Получаем токен из cookies
    const token = Cookies.get("token") || "";

    // Выполняем запрос к API для получения профиля пользователя
    const { data } = await axios.get(`/api/user/profile/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // При успешной загрузке обновляем состояние в Redux с профилем
    dispatch(updateProfileSuccess(data));

  } catch (error) {
    // В случае ошибки обновляем состояние с ошибкой
    dispatch(updateProfileFailure(error.message || "Ошибка при загрузке профиля"));
  }
};
