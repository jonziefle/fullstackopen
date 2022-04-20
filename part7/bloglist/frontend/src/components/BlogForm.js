import React, { useState } from "react";

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
          title:
          <input
            className="title-input"
            value={newTitle}
            onChange={handleTitleChange}
          />
        </div>
        <div>
          author:
          <input
            className="author-input"
            value={newAuthor}
            onChange={handleAuthorChange}
          />
        </div>
        <div>
          url:
          <input
            className="url-input"
            value={newURL}
            onChange={handleURLChange}
          />
        </div>
        <button className="save-button" type="submit">
          create
        </button>
      </form>
    </div>
  );
};

export default BlogForm;
