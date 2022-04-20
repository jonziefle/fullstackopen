import React from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "../reducers/authReducer";

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
          username
          <input name="username" className="username-input" type="text" />
        </div>
        <div>
          password
          <input name="password" className="password-input" type="password" />
        </div>
        <button className="login-button" type="submit">
          login
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
