import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";

import { GET_ALL_BOOKS } from "../queries";

const Books = ({ show }) => {
  const [genreList, setGenreList] = useState([]);
  const [genreFilter, setGenreFilter] = useState("");
  const result = useQuery(GET_ALL_BOOKS);

  useEffect(() => {
    if (result.data) {
      let genreListTemp = [];
      result.data.allBooks.forEach((book) => {
          book.genres.forEach((genre) => {
              if (!genreListTemp.includes(genre)) {
                genreListTemp.push(genre);
              }
          })
      });
      
      setGenreList(genreListTemp);
      setGenreFilter("all genres");
    }
  }, [result.data]); // eslint-disable-line

  const filteredBooks = () => {
    if (genreFilter !== "all genres") {
      return result.data.allBooks.filter((book) => {
        return book.genres.find((genre) => {
          return genre.toLowerCase() === genreFilter.toLowerCase();
        });
      });
    }
    return result.data.allBooks;
  };

  if (!show) {
    return null;
  }

  if (result.loading) {
    return <div>loading...</div>;
  }

  return (
    <div>
      <h2>books</h2>
      <span>
        in genre <b>{genreFilter}</b>
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
      <div>
        {genreList.map((genre) => (
          <button key={genre} onClick={() => setGenreFilter(genre)}>
            {genre}
          </button>
        ))}
        <button onClick={() => setGenreFilter("all genres")}>all genres</button>
      </div>
    </div>
  );
};

export default Books;
