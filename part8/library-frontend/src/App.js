import { useState } from "react";
import { useApolloClient } from "@apollo/client";

import Navigation from "./components/Navigation";
import Authors from "./components/Authors";
import Books from "./components/Books";
import Recommendations from "./components/Recommendations";
import LoginForm from "./components/LoginForm";
import NewBook from "./components/NewBook";

const App = () => {
  const [token, setToken] = useState(null);
  const [page, setPage] = useState("authors");

  const client = useApolloClient();

  const logout = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();
    setPage("authors");
  };

  return (
    <div>
      <Navigation setPage={setPage} token={token} logout={logout} />
      <Authors show={page === "authors"} token={token} />
      <Books show={page === "books"} />
      <Recommendations show={page === "recommendations"} />
      <LoginForm
        show={page === "login"}
        setToken={setToken}
        setPage={setPage}
      />
      <NewBook show={page === "add"} />
    </div>
  );
};

export default App;
