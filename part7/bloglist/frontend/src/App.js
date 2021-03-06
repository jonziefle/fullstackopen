import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route, useMatch } from "react-router-dom";

import { Container } from "@mui/material";

import Navigation from "./components/Navigation";
import Notification from "./components/Notification";
import LoginForm from "./components/LoginForm";
import BlogForm from "./components/BlogForm";
import BlogList from "./components/BlogList";
import Blog from "./components/Blog";
import Togglable from "./components/Togglable";

import UserList from "./components/UserList";
import UserBlogList from "./components/UserBlogList";

import { initializeUser } from "./reducers/authReducer";
import { initializeUsers } from "./reducers/userReducer";
import { initializeBlogs, createBlog } from "./reducers/blogReducer";
import { setNotification } from "./reducers/notificationReducer";

const App = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const users = useSelector((state) => state.users);
  const blogs = useSelector((state) => state.blogs);

  const blogFormRef = useRef();

  useEffect(() => {
    dispatch(initializeUser());
    dispatch(initializeUsers());
    dispatch(initializeBlogs());
  }, [dispatch]);

  const userIdMatch = useMatch("/users/:id");
  const userDetails = userIdMatch
    ? users.find((user) => user.id === userIdMatch.params.id)
    : null;
  const userBlogs = userIdMatch
    ? blogs.filter((blog) => blog.user.id === userIdMatch.params.id)
    : null;

  const blogIdMatch = useMatch("/blogs/:id");
  const blogDetails = blogIdMatch
    ? blogs.find((blog) => blog.id === blogIdMatch.params.id)
    : null;

  const addBlog = async (blog) => {
    try {
      blogFormRef.current.toggleVisibility();
      dispatch(createBlog(blog));
      dispatch(
        setNotification(
          `Added new blog "${blog.title}" by ${blog.author}`,
          "success"
        )
      );
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

  const Home = () => {
    return (
      <div>
        {user === null ? loginForm() : blogForm()}
        <BlogList />
      </div>
    );
  };

  return (
    <Container>
      <Notification />
      <Navigation />
      
      <h2>Blog List App</h2>

      <Routes>
        <Route
          path="/users/:id"
          element={
            <UserBlogList userDetails={userDetails} userBlogs={userBlogs} />
          }
        />
        <Route path="/users" element={<UserList />} />
        <Route path="/blogs/:id" element={<Blog blog={blogDetails} />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Container>
  );
};

export default App;
