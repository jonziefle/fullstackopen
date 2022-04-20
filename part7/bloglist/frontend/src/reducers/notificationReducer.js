import { createSlice } from "@reduxjs/toolkit";

let timer = null;
const initialState = null;

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    show(state, action) {
      return action.payload;
    },
    // eslint-disable-next-line
    hide(state, action) {
      return null;
    },
  },
});

const { show, hide } = notificationSlice.actions;

export const setNotification = (text, type) => {
  return (dispatch) => {
    clearTimeout(timer);
    dispatch(show({ text, type }));
    timer = setTimeout(() => {
      dispatch(hide());
    }, 5000);
  };
};

export default notificationSlice.reducer;
