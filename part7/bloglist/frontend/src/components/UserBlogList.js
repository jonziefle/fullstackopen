import React from "react";

const UserBlogList = ({ userDetails, userBlogs }) => {
  if (!userDetails) {
    return null;
  }
  if (userBlogs.length === 0) {
    return (
      <div>
        <h2>{userDetails.name}</h2>
        <h3>no blogs added</h3>
      </div>
    );
  }
  return (
    <div>
      <h2>{userDetails.name}</h2>
      <h3>added blogs</h3>
      <ul>
        {userBlogs.map((blog) => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default UserBlogList;
