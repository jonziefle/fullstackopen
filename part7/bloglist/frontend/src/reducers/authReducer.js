import { createSlice } from "@reduxjs/toolkit";
import blogService from "../services/blogs";
import loginService from "../services/login";
import { setNotification } from "../reducers/notificationReducer";

const initialState = null;

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      return action.payload;
    },
    // eslint-disable-next-line
    logout(state, action) {
      return null;
    },
  },
});

const { login, logout } = authSlice.actions;

export const initializeUser = () => {
  return (dispatch) => {
    const authorizedUserJSON = window.localStorage.getItem("authorizedUser");
    if (authorizedUserJSON) {
      const user = JSON.parse(authorizedUserJSON);
      blogService.setToken(user.token);
      dispatch(login(user));
    }
  };
};

export const loginUser = (username, password) => {
  return async (dispatch) => {
    try {
      const user = await loginService.login({
        username,
        password,
      });

      window.localStorage.setItem("authorizedUser", JSON.stringify(user));

      blogService.setToken(user.token);
      dispatch(login(user));
      dispatch(setNotification(`${user.name} is logged in`, "message"));
    } catch (exception) {
      dispatch(setNotification(`Unable to login ${username}`, "error"));
    }
  };
};

export const logoutUser = (user) => {
  return (dispatch) => {
    window.localStorage.removeItem("authorizedUser");
    blogService.setToken(null);
    dispatch(logout());
    dispatch(setNotification(`${user.username} logged out`, "message"));
  };
};

export default authSlice.reducer;
