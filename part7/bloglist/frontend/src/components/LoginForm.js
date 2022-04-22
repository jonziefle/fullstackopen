import React from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "../reducers/authReducer";

import { TextField, Button } from "@mui/material";

const LoginForm = () => {
  const dispatch = useDispatch();

  const handleLogin = async (event) => {
    event.preventDefault();
    const username = event.target.username.value;
    const password = event.target.password.value;
    event.target.username.value = "";
    event.target.password.value = "";
    dispatch(loginUser(username, password));
  };

  return (
    <div>
      <h3>Login</h3>
      <form onSubmit={handleLogin}>
        <div>
          <TextField
            label="username"
            size="small"
            name="username"
            className="username-input"
            type="text"
          />
        </div>
        <div>
          <TextField
            label="password"
            size="small"
            name="password"
            className="password-input"
            type="password"
          />
        </div>
        <Button
          variant="contained"
          size="small"
          color="primary"
          className="login-button"
          type="submit"
        >
          login
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;
