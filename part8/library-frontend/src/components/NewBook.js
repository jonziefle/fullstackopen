import { useState } from "react";
import { useMutation } from "@apollo/client";

import {
  ADD_NEW_BOOK,
  GET_ALL_AUTHORS,
  GET_ALL_BOOKS,
  GET_ALL_BOOKS_BY_GENRE,
} from "../queries";

import { updateCache } from "../App";

const NewBook = ({ show, user }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [published, setPublished] = useState("");
  const [genre, setGenre] = useState("");
  const [genres, setGenres] = useState([]);

  const [addNewBook] = useMutation(ADD_NEW_BOOK, {
    refetchQueries: [{ query: GET_ALL_AUTHORS }],
    update: (cache, response) => {
      updateCache(cache, { query: GET_ALL_BOOKS }, response.data.addBook);
      
      cache.updateQuery(
        {
          query: GET_ALL_BOOKS_BY_GENRE,
          variables: {
            genre: user.data?.me?.favoriteGenre,
          },
        },
        ({ allBooks }) => {
          if (
            response.data.addBook.genres.includes(user.data?.me?.favoriteGenre)
          ) {
            return {
              allBooks: allBooks.concat(response.data.addBook),
            };
          }
          return { allBooks };
        }
      );
    },
  });

  const submit = async (event) => {
    event.preventDefault();

    addNewBook({ variables: { title, author, published, genres } });

    setTitle("");
    setPublished("");
    setAuthor("");
    setGenres([]);
    setGenre("");
  };

  const addGenre = () => {
    setGenres(genres.concat(genre));
    setGenre("");
  };

  if (!show) {
    return null;
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(Number(target.value))}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(" ")}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  );
};

export default NewBook;
