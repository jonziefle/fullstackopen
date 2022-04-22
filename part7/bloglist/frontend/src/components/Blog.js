import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { Button, TextField } from "@mui/material";

import { incrementLike, removeBlog, addComment } from "../reducers/blogReducer";
import { setNotification } from "../reducers/notificationReducer";

const Blog = ({ blog }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [newComment, setNewComment] = useState("");
  const handleCommentChange = (event) => setNewComment(event.target.value);

  const handleLike = () => {
    try {
      dispatch(incrementLike(blog));
      dispatch(
        setNotification(
          `Added like to "${blog.title}" by ${blog.author}`,
          "success"
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
            "success"
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

  const handleComment = (event) => {
    event.preventDefault();
    dispatch(addComment(blog.id, newComment));
    setNewComment("");
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
      </div>
      <div>
        <div>added by {blog.user ? blog.user.name : ""}</div>
        <Button
          variant="contained"
          color="primary"
          size="small"
          className="like-button"
          onClick={handleLike}
        >
          like
        </Button>
        {blog.user && blog.user.username === user.username && (
          <Button
            variant="contained"
            color="error"
            size="small"
            className="remove-button"
            onClick={handleRemove}
          >
            remove
          </Button>
        )}
      </div>
      <div>
        <h3>comments</h3>
        <form className="comment-form" onSubmit={handleComment}>
          <div>
            <TextField
              label="comment"
              size="small"
              className="comment-input"
              value={newComment}
              onChange={handleCommentChange}
            />
          </div>
          <Button
              variant="contained"
              color="primary"
              size="small"
              className="add-comment"
              type="submit"
            >
              add comment
            </Button>
        </form>
        <ul>
          {blog.comments.map((comment, index) => (
            <li key={index}>{comment}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Blog;
