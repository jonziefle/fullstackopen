import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { incrementLike, removeBlog } from "../reducers/blogReducer";
import { setNotification } from "../reducers/notificationReducer";

const Blog = ({ blog }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const [visible, setVisible] = useState(false);

  const showWhenVisible = { display: visible ? "" : "none" };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  const handleLike = () => {
    try {
      dispatch(incrementLike(blog));
      dispatch(
        setNotification(
          `Added like to "${blog.title}" by ${blog.author}`,
          "message"
        )
      );
    } catch (exception) {
      dispatch(
        setNotification(
          `Unable to add like to "${blog.title}" by ${blog.author}`,
          "error"
        )
      );
    }
  };

  const handleRemove = () => {
    if (window.confirm(`Delete "${blog.title}" by ${blog.author}?`)) {
      try {
        dispatch(removeBlog(blog));
        dispatch(
          setNotification(
            `Deleted "${blog.title}" by ${blog.author}`,
            "message"
          )
        );
      } catch (exception) {
        dispatch(
          setNotification(
            `Unable to delete "${blog.title}" by ${blog.author}`,
            "error"
          )
        );
      }
    }
  };

  return (
    <div className="blog">
      {`"${blog.title}" by ${blog.author}`}
      <button className="toggle-button" onClick={toggleVisibility}>
        {visible ? "hide" : "view"}
      </button>
      <div className="additional-content" style={showWhenVisible}>
        <div>url: {blog.url}</div>
        <div>
          likes: {blog.likes}
          <button className="like-button" onClick={handleLike}>
            like
          </button>
        </div>
        <div>user: {blog.user ? blog.user.name : ""}</div>
        {blog.user && blog.user.username === user.username && (
          <button className="remove-button" onClick={handleRemove}>
            remove
          </button>
        )}
      </div>
    </div>
  );
};

export default Blog;
