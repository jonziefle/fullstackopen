import { createSlice } from "@reduxjs/toolkit";

let timer = null;
const initialState = null;

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    // eslint-disable-next-line
    showNotification(state, action) {
      return action.payload;
    },
    // eslint-disable-next-line
    hideNotification(state, action) {
      return null;
    },
  },
});

const { showNotification, hideNotification } = notificationSlice.actions;

export const setNotification = (text, type) => {
  return (dispatch) => {
    clearTimeout(timer);
    dispatch(showNotification({ text, type }));
    timer = setTimeout(() => {
      dispatch(hideNotification());
    }, 5000);
  };
};

export default notificationSlice.reducer;
