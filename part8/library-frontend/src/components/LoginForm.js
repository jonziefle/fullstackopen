import { useState, useEffect } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import { LOGIN, GET_ME } from "../queries";

const LoginForm = ({ show, setError, setToken, setUser, setPage }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [getUser, userResult] = useLazyQuery(GET_ME);
  const [login, loginResult] = useMutation(LOGIN, {
    onError: (error) => {
      setError(error.graphQLErrors[0].message);
    },
  });

  // set token
  useEffect(() => {
    if (loginResult.data) {
      const token = loginResult.data.login.value;
      setToken(token);
      localStorage.setItem("library-user-token", token);
      setPage("authors");
      getUser({});
    }
  }, [loginResult.data]); // eslint-disable-line

  // set user info
  useEffect(() => {
    if (userResult.data) {
      setUser(userResult);
    }
  }, [userResult.data]); // eslint-disable-line

  const submit = async (event) => {
    event.preventDefault();
    login({ variables: { username, password } });
    setUsername("");
    setPassword("");
  };

  if (!show) {
    return null;
  }

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={submit}>
        <div>
          username{" "}
          <input
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password{" "}
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  );
};

export default LoginForm;
