import React, { useState } from "react";

import { TextField, Button } from "@mui/material";

const BlogForm = ({ addBlog }) => {
  const [newTitle, setNewTitle] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [newURL, setNewURL] = useState("");

  const handleTitleChange = (event) => setNewTitle(event.target.value);
  const handleAuthorChange = (event) => setNewAuthor(event.target.value);
  const handleURLChange = (event) => setNewURL(event.target.value);

  const handleForm = (event) => {
    event.preventDefault();
    addBlog({
      title: newTitle,
      author: newAuthor,
      url: newURL,
    });

    setNewTitle("");
    setNewAuthor("");
    setNewURL("");
  };

  return (
    <div>
      <h3>Add a New Blog</h3>
      <form className="blog-form" onSubmit={handleForm}>
        <div>
          <TextField
            label="title"
            size="small"
            className="title-input"
            value={newTitle}
            onChange={handleTitleChange}
          />
        </div>
        <div>
          <TextField
            label="author"
            size="small"
            className="author-input"
            value={newAuthor}
            onChange={handleAuthorChange}
          />
        </div>
        <div>
          <TextField
            label="url"
            size="small"
            className="url-input"
            value={newURL}
            onChange={handleURLChange}
          />
        </div>
        <Button
          variant="contained"
          size="small"
          color="primary"
          className="save-button"
          type="submit"
        >
          create
        </Button>
      </form>
    </div>
  );
};

export default BlogForm;
