import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../reducers/authReducer";
import userReducer from "../reducers/userReducer";
import blogReducer from "../reducers/blogReducer";
import notificationReducer from "../reducers/notificationReducer";

const store = configureStore({
  reducer: {
    user: authReducer,
    users: userReducer,
    blogs: blogReducer,
    notification: notificationReducer,
  },
});

export default store;
