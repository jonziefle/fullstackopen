import React from "react";
import { useSelector } from "react-redux";

import Blog from "./Blog";

const BlogList = () => {
  const blogs = useSelector((state) => state.blogs);

  return (
    <div className="blog-list">
      <h3>List</h3>
      {[...blogs]
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
          />
        ))}
    </div>
  );
};

export default BlogList;
