import { useState, useEffect } from "react";
import { useQuery, useLazyQuery } from "@apollo/client";

import { GET_ALL_BOOKS, GET_ALL_BOOKS_BY_GENRE } from "../queries";

const Books = ({ show }) => {
  const [genreList, setGenreList] = useState([]);
  const [genreFilter, setGenreFilter] = useState("all genres");
  const [booksList, setBooksList] = useState([]);
  const [booksByGenreList, setBooksByGenreList] = useState([]);

  const books = useQuery(GET_ALL_BOOKS);
  const [getBooksByGenre, booksByGenre] = useLazyQuery(GET_ALL_BOOKS_BY_GENRE);

  useEffect(() => {
    if (books.data) {
      setBooksList(books.data.allBooks);

      // set genres for buttons
      let genreTemp = [];
      books.data.allBooks.forEach((book) => {
        book.genres.forEach((genre) => {
          if (!genreTemp.includes(genre)) {
            genreTemp.push(genre);
          }
        });
      });
      setGenreList(genreTemp);
    }
  }, [books.data]); // eslint-disable-line

  useEffect(() => {
    if (booksByGenre.data) {
      setBooksByGenreList(booksByGenre.data.allBooks);
    }
  }, [booksByGenre.data]); // eslint-disable-line

  const changeGenre = async (genre) => {
    setGenreFilter(genre);
    if (genre !== "all genres") {
      getBooksByGenre({ variables: { genre } });
    }
  };

  const filteredBooks = () => {
    if (genreFilter !== "all genres") {
      return booksByGenreList;
    }
    return booksList;
  };

  if (!show) {
    return null;
  }

  if (booksList.loading) {
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
          <button key={genre} onClick={() => changeGenre(genre)}>
            {genre}
          </button>
        ))}
        <button onClick={() => changeGenre("all genres")}>all genres</button>
      </div>
    </div>
  );
};

export default Books;
