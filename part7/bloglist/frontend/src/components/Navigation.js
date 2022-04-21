import React from "react";
import { Link } from "react-router-dom";

const Navigation = () => {
  const padding = {
    paddingRight: 5,
  };
  return (
    <div>
      <Link style={padding} to="/">
        blogs
      </Link>
      <Link style={padding} to="/users">
        users
      </Link>
    </div>
  );
};

export default Navigation;
