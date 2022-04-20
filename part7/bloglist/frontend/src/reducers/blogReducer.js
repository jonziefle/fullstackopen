import { createSlice } from "@reduxjs/toolkit";
import blogService from "../services/blogs";

const blogSlice = createSlice({
  name: "blogs",
  initialState: [],
  reducers: {
    init(state, action) {
      return action.payload;
    },
    add(state, action) {
      state.push(action.payload);
    },
    update(state, action) {
      const updatedBlog = action.payload;
      return state.map((blog) =>
        blog.id !== updatedBlog.id ? blog : updatedBlog
      );
    },
    remove(state, action) {
      const id = action.payload;
      return state.filter((blog) => blog.id !== id);
    },
  },
});

export const { init, add, update, remove } =
  blogSlice.actions;

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll();
    dispatch(init(blogs));
  };
};

export const createBlog = (blog) => {
  return async (dispatch) => {
    const newBlog = await blogService.create(blog);
    dispatch(add(newBlog));
  };
};

export const incrementLike = (blog) => {
  return async (dispatch) => {
    const updatedBlog = await blogService.update({
      ...blog,
      likes: blog.likes + 1,
    });
    dispatch(update(updatedBlog));
  };
};

export const removeBlog = (blog) => {
  return async (dispatch) => {
    await blogService.remove(blog.id);
    dispatch(remove(blog.id));
  };
};

export default blogSlice.reducer;
