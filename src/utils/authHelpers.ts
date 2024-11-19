import Cookies from "js-cookie";
import { setToken } from "./store/slices/authSlice";
import { AppDispatch } from "./store/store";

export const loadTokenFromCookies = (dispatch: AppDispatch) => {
  const token = Cookies.get("token");
  if (token) {
    dispatch(setToken(token));
  }
};
export const logout = (dispatch: AppDispatch) => {
  Cookies.remove("token");
  dispatch(setToken(null));
};