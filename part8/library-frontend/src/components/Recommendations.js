import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";

import { GET_ME, GET_ALL_BOOKS } from "../queries";

const Recommendations = ({ show }) => {
  const user = useQuery(GET_ME);
  const result = useQuery(GET_ALL_BOOKS);
  const [genreFilter, setGenreFilter] = useState("");

  useEffect(() => {
    if (user.data) {
      setGenreFilter(user.data.me.favoriteGenre);
    }
  }, [user.data]); // eslint-disable-line

  const filteredBooks = () => {
    return result.data.allBooks.filter((book) => {
      return book.genres.find((genre) => {
        return genre.toLowerCase() === genreFilter.toLowerCase();
      });
    });
  };

  if (!show) {
    return null;
  }

  if (result.loading) {
    return <div>loading...</div>;
  }

  return (
    <div>
      <h2>recommendations</h2>
      <span>
        books in your favorite genre <b>{genreFilter}</b>
      </span>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {filteredBooks().map((a) => (
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
