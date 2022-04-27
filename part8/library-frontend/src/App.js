import { useState } from "react";
import { useQuery, useApolloClient, useSubscription } from "@apollo/client";

import Navigation from "./components/Navigation";
import Authors from "./components/Authors";
import Books from "./components/Books";
import Recommendations from "./components/Recommendations";
import LoginForm from "./components/LoginForm";
import NewBook from "./components/NewBook";

import { BOOK_ADDED, GET_ALL_BOOKS } from "./queries";

// function that takes care of manipulating cache
export const updateCache = (cache, query, addedBook) => {
  const uniqueByTitle = (a) => {
    let seen = new Set();
    return a.filter((item) => {
      let k = item.title;
      return seen.has(k) ? false : seen.add(k);
    });
  };
  cache.updateQuery(query, ({ allBooks }) => {
    return {
      allBooks: uniqueByTitle(allBooks.concat(addedBook)),
    };
  });
};

const App = () => {
  const [token, setToken] = useState(null);
  const [page, setPage] = useState("authors");
  const [user, setUser] = useState({});

  const client = useApolloClient();

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const addedBook = subscriptionData.data.bookAdded;
      window.alert(`${addedBook.title} added`);
      updateCache(client.cache, { query: GET_ALL_BOOKS }, addedBook);
    },
  });

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
      <Recommendations show={page === "recommendations"} user={user} />
      <LoginForm
        show={page === "login"}
        setToken={setToken}
        setUser={setUser}
        setPage={setPage}
      />
      <NewBook show={page === "add"} user={user} />
    </div>
  );
};

export default App;
