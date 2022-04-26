import { gql } from "@apollo/client";

export const GET_ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      bookCount
    }
  }
`;

export const GET_ALL_BOOKS = gql`
  query {
    allBooks {
      title
      published
      author {
        name
      }
      genres
    }
  }
`;

export const GET_ALL_BOOKS_BY_GENRE = gql`
  query getAllBooksByGenre($genre: String!) {
    allBooks(genre: $genre) {
      title
      published
      author {
        name
      }
      genres
    }
  }
`;

export const GET_ME = gql`
  query {
    me {
      username
      favoriteGenre
    }
  }
`;

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`;

export const ADD_NEW_BOOK = gql`
  mutation addNewBook(
    $title: String!
    $author: String!
    $published: Int!
    $genres: [String!]!
  ) {
    addBook(
      title: $title
      author: $author
      published: $published
      genres: $genres
    ) {
      title
      author {
        name
      }
      published
      genres
    }
  }
`;

export const EDIT_BIRTHYEAR = gql`
  mutation editAuthor($name: String!, $year: Int!) {
    editAuthor(name: $name, setBornTo: $year) {
      name
      born
      bookCount
    }
  }
`;
