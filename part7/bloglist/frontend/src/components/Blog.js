import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { incrementLike, removeBlog } from "../reducers/blogReducer";
import { setNotification } from "../reducers/notificationReducer";

const Blog = ({ blog }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

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
        navigate("/");
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

  if (!blog) {
    return null;
  }

  return (
    <div className="blog">
      <h2>{`"${blog.title}" by ${blog.author}`}</h2>
      <a href={blog.url}>{blog.url}</a>
      <div>
        <span>{blog.likes} likes</span>
        <button className="like-button" onClick={handleLike}>
          like
        </button>
      </div>
      <div>
        <div>added by {blog.user ? blog.user.name : ""}</div>
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
