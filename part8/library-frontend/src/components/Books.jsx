import { useState, useEffect } from "react";
import { useQuery, useLazyQuery } from "@apollo/client/react";

import { ALL_BOOKS } from "../queries";

const Books = (props) => {
  const [filteredBooks, setFilteredBooks] = useState([]);
  const result = useQuery(ALL_BOOKS);
  const [getSelectedGenre, { data }] = useLazyQuery(ALL_BOOKS);

  useEffect(() => {
    if (data?.allBooks) {
      setFilteredBooks(data.allBooks);
    }
  }, [data]);

  if (!props.show) {
    return null;
  }
  if (result.loading) {
    return <div>Loading...</div>;
  }
  const unfilteredBooks = result.data.allBooks;
  const uniqueGenres = [
    ...new Set(result.data.allBooks.flatMap((b) => b.genres)),
  ];
  const books = filteredBooks.length > 0 ? filteredBooks : unfilteredBooks;

  const handleFilter = (genre) => {
    if (genre === "all") {
      setFilteredBooks(unfilteredBooks);
    }
    getSelectedGenre({ variables: { genre } });
  };

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => handleFilter("all")}>all genres</button>
      {uniqueGenres.map((g) => (
        <button key={g} onClick={() => handleFilter(g)}>
          {g}
        </button>
      ))}
    </div>
  );
};

export default Books;
