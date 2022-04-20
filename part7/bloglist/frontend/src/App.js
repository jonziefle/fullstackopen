import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";

import Blog from "./components/Blog";
import Notification from "./components/Notification";
import LoginForm from "./components/LoginForm";
import BlogForm from "./components/BlogForm";
import Togglable from "./components/Togglable";

import loginService from "./services/login";
import blogService from "./services/blogs";

import { setNotification } from "./reducers/notificationReducer";

const App = () => {
  const dispatch = useDispatch();

  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  
  const blogFormRef = useRef();

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const authorizedUserJSON = window.localStorage.getItem("authorizedUser");
    if (authorizedUserJSON) {
      const user = JSON.parse(authorizedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });

      window.localStorage.setItem("authorizedUser", JSON.stringify(user));

      blogService.setToken(user.token);
      setUser(user);
      dispatch(setNotification(`${user.name} is logged in`, "message"));
      setUsername("");
      setPassword("");
    } catch (exception) {
      dispatch(setNotification(`Unable to login ${username}`, "error"));
    }
  };

  const handleLogout = async (event) => {
    event.preventDefault();

    window.localStorage.removeItem("authorizedUser");
    blogService.setToken(null);
    dispatch(setNotification(`${user.username} logged out`, "message"));
    setUser(null);
  };

  const addBlog = async (blogObject) => {
    try {
      const newBlog = await blogService.create(blogObject);
      setBlogs(blogs.concat(newBlog));
      blogFormRef.current.toggleVisibility();

      dispatch(
        setNotification(
          `Added new blog "${blogObject.title}" by ${blogObject.author}`,
          "message"
        )
      );
    } catch (exception) {
      dispatch(
        setNotification(
          `Unable to add blog "${blogObject.title}" by ${blogObject.author}`,
          "error"
        )
      );
    }
  };

  const updateBlog = async (blogObject) => {
    try {
      const updatedBlog = await blogService.update(blogObject);
      setBlogs(
        blogs.map((blog) => (blog.id !== blogObject.id ? blog : updatedBlog))
      );

      dispatch(
        setNotification(
          `Added like to "${blogObject.title}" by ${blogObject.author}`,
          "message"
        )
      );
    } catch (exception) {
      dispatch(
        setNotification(
          `Unable to add like to "${blogObject.title}" by ${blogObject.author}`,
          "error"
        )
      );
    }
  };

  const deleteBlog = async (blogObject) => {
    if (
      window.confirm(`Delete "${blogObject.title}" by ${blogObject.author}?`)
    ) {
      try {
        await blogService.remove(blogObject.id);
        setBlogs(blogs.filter((blog) => blog.id !== blogObject.id));

        dispatch(
          setNotification(
            `Deleted "${blogObject.title}" by ${blogObject.author}`,
            "message"
          )
        );
      } catch (exception) {
        dispatch(
          setNotification(
            `Unable to delete "${blogObject.title}" by ${blogObject.author}`,
            "error"
          )
        );
      }
    }
  };

  const loginForm = () => (
    <Togglable buttonLabel="log in">
      <LoginForm
        username={username}
        password={password}
        handleUsernameChange={({ target }) => setUsername(target.value)}
        handlePasswordChange={({ target }) => setPassword(target.value)}
        handleSubmit={handleLogin}
      />
    </Togglable>
  );

  const blogForm = () => (
    <Togglable buttonLabel="create new blog" ref={blogFormRef}>
      <BlogForm createBlog={addBlog} />
    </Togglable>
  );

  const blogUser = () => (
    <>
      <h3>User</h3>
      {user.name} logged-in
      <button onClick={handleLogout}>logout</button>
    </>
  );

  const blogList = () => (
    <div className="blog-list">
      <h3>List</h3>
      {blogs
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Blog
            key={blog.id}
            user={user}
            blog={blog}
            updateBlog={updateBlog}
            deleteBlog={deleteBlog}
          />
        ))}
    </div>
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
          {blogList()}
        </div>
      )}
    </div>
  );
};

export default App;
