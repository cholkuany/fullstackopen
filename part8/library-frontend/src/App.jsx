import { useState, useEffect } from "react";
import { useApolloClient, useQuery } from "@apollo/client/react";

import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import LoginForm from "./components/LoginForm";
import Recommendation from "./components/Recommendation";

import { ME } from "./queries";

const App = () => {
  const [page, setPage] = useState("authors");
  const [token, setToken] = useState(null);

  const result = useQuery(ME);
  const client = useApolloClient();

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

      <Authors show={page === "authors"} />
      <Books show={page === "books"} />
      {token && <NewBook show={page === "add"} />}
      {page === "recommend" && token && <Recommendation genre={genre} />}
      {page === "login" && <LoginForm setPage={setPage} setToken={setToken} />}
    </div>
  );
};

export default App;
