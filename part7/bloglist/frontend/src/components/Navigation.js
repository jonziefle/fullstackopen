import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../reducers/authReducer";

const Navigation = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser(user));
    navigate("/");
  };

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
      {user ? (
        <span>
          {user.name} logged-in
          <button onClick={handleLogout}>logout</button>
        </span>
      ) : (
        <Link style={padding} to="/">
          login
        </Link>
      )}
    </div>
  );
};

export default Navigation;
