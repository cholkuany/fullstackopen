import { useState, useEffect } from "react";
import { useApolloClient, useQuery, useSubscription } from "@apollo/client/react";

import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import LoginForm from "./components/LoginForm";
import Recommendation from "./components/Recommendation";

import { ME, BOOK_ADDED, ALL_BOOKS } from "./queries";

const App = () => {
  const [page, setPage] = useState("authors");
  const [token, setToken] = useState(null);
  const [message, setMessage] = useState(null);

  const result = useQuery(ME);
  const client = useApolloClient();

  useSubscription(BOOK_ADDED, {
    onData: ({ client, data }) => {
      const addedBook = data.data.bookAdded;
      client.cache.updateQuery({ query: ALL_BOOKS }, ({ allBooks }) => {
        return {
          allBooks: allBooks.concat(addedBook),
        };
      });
      notify(`Added ${addedBook.title}`);
    },
  });

  useEffect(() => {
    const localToken = localStorage.getItem("currentUser-token");
    if (localToken) {
      setToken(localToken);
    }
  }, []);

  let genre = "";
  if (result?.data?.me) {
    genre = result.data.me?.favoriteGenre;
  }

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("currentUser-token");
    if (page === "add" || "recommend") {
      setPage("authors");
    }
    client.resetStore();
  };

  const notify = (message) => {
    setMessage(message);
    setTimeout(() => {
      setMessage(null);
    }, 5000);
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        {token ? (
          <>
            <button onClick={() => setPage("add")}>add book</button>
            <button onClick={() => setPage("recommend")}>recommend</button>
            <button onClick={handleLogout}>logout</button>
          </>
        ) : (
          <button onClick={() => setPage("login")}>login</button>
        )}
      </div>

      {message && <div style={{ marginTop: "5px", marginBottom: "5px", color: "white", background: "green", padding: "10px" }}>{message}</div>}

      <Authors show={page === "authors"} token={token} notify={notify} />
      <Books show={page === "books"} />
      {token && <NewBook show={page === "add"} />}
      {page === "recommend" && token && <Recommendation genre={genre} />}
      {page === "login" && <LoginForm setPage={setPage} setToken={setToken} />}
    </div>
  );
};

export default App;
