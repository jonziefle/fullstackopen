import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../reducers/authReducer";
import blogReducer from "../reducers/blogReducer";
import notificationReducer from "../reducers/notificationReducer";

const store = configureStore({
  reducer: {
    user: authReducer,
    blogs: blogReducer,
    notification: notificationReducer,
  },
});

export default store;
