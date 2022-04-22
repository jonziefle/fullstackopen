import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { AppBar, Toolbar, Button } from "@mui/material";

import { logoutUser } from "../reducers/authReducer";

const Navigation = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser(user));
    navigate("/");
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Button color="inherit" component={Link} to="/">
          blogs
        </Button>
        <Button color="inherit" component={Link} to="/users">
          notes
        </Button>
        {user ? (
          <span>
            <Button color="secondary" onClick={handleLogout}>
              logout
            </Button>
            {user.name} logged-in
          </span>
        ) : (
          <Button color="secondary" component={Link} to="/">
            login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;
