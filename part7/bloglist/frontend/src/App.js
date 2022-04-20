import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import Notification from "./components/Notification";
import LoginForm from "./components/LoginForm";
import BlogForm from "./components/BlogForm";
import BlogList from "./components/BlogList";
import Togglable from "./components/Togglable";

import { initializeUser, logoutUser } from "./reducers/authReducer";
import { initializeBlogs, createBlog } from "./reducers/blogReducer";
import { setNotification } from "./reducers/notificationReducer";

const App = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const blogFormRef = useRef();

  useEffect(() => {
    dispatch(initializeUser());
    dispatch(initializeBlogs());
  }, [dispatch]);

  const addBlog = async (blog) => {
    try {
      blogFormRef.current.toggleVisibility();
      dispatch(createBlog(blog));
      console.log("hello");
      dispatch(
        setNotification(
          `Added new blog "${blog.title}" by ${blog.author}`,
          "message"
        )
      );
      console.log("bye");
    } catch (exception) {
      dispatch(
        setNotification(
          `Unable to add blog "${blog.title}" by ${blog.author}`,
          "error"
        )
      );
    }
  };

  const loginForm = () => (
    <Togglable buttonLabel="log in">
      <LoginForm />
    </Togglable>
  );

  const blogForm = () => (
    <Togglable buttonLabel="create new blog" ref={blogFormRef}>
      <BlogForm addBlog={addBlog} />
    </Togglable>
  );

  const blogUser = () => (
    <>
      <h3>User</h3>
      {user.name} logged-in
      <button onClick={() => dispatch(logoutUser(user))}>logout</button>
    </>
  );

  return (
    <div>
      <h2>Blog List App</h2>
      <Notification />

      {user === null ? (
        <div>{loginForm()}</div>
      ) : (
        <div>
          {blogUser()}
          {blogForm()}
          <BlogList />
        </div>
      )}
    </div>
  );
};

export default App;
