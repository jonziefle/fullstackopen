import { useState, useEffect } from "react";
import { useLazyQuery } from "@apollo/client";

import { GET_ALL_BOOKS_BY_GENRE } from "../queries";

const Recommendations = ({ show, user }) => {
  const [userFavoriteGenre, setUserFavoriteGenre] = useState([]);
  const [favoriteBooks, setFavoriteBooks] = useState([]);

  const [getBooksByGenre, booksByGenre] = useLazyQuery(GET_ALL_BOOKS_BY_GENRE);

  // get books by user favorite genre
  useEffect(() => {
    if (user.data && user.data.me !== null) {
      setUserFavoriteGenre(user.data.me.favoriteGenre);
      getBooksByGenre({ variables: { genre: user.data.me.favoriteGenre } });
    }
  }, [user.data]); // eslint-disable-line

  // set books by user favorite genre
  useEffect(() => {
    if (booksByGenre.data) {
      setFavoriteBooks(booksByGenre.data.allBooks);
    }
  }, [booksByGenre.data]); // eslint-disable-line

  if (!show) {
    return null;
  }

  if (booksByGenre.loading) {
    return <div>loading...</div>;
  }

  return (
    <div>
      <h2>recommendations</h2>
      <span>
        books in your favorite genre <b>{userFavoriteGenre}</b>
      </span>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {favoriteBooks.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Recommendations;
