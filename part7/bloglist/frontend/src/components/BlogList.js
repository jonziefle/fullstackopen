import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const BlogLink = ({ blog }) => {
  return (
    <div className="blog-link">
      <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
    </div>
  );
};

const BlogList = () => {
  const blogs = useSelector((state) => state.blogs);

  return (
    <div className="blog-list">
      <h3>List</h3>
      {[...blogs]
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <BlogLink key={blog.id} blog={blog} />
        ))}
    </div>
  );
};

export default BlogList;
