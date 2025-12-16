import { gql } from "@apollo/client";

export const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      bookCount
      id
    }
  }
`;

export const ALL_BOOKS = gql`
  query AllBooks($genre: String, $author: String) {
    allBooks(genre: $genre, author: $author) {
      title
      published
      genres
      author {
        bookCount
        born
        name
        id
      }
      id
    }
  }
`;

export const ME = gql`
  query me {
    me {
      favoriteGenre
    }
  }
`;

export const ADD_BOOK = gql`
  mutation createBook(
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
        bookCount
        born
        name
        id
      }
      published
      id
    }
  }
`;

export const EDIT_AUTHOR = gql`
  mutation editBorn($name: String!, $born: Int!) {
    editAuthor(name: $name, born: $born) {
      name
      born
      bookCount
      id
    }
  }
`;

export const LOGIN_USER = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`;
