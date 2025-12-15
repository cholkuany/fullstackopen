import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

import { ApolloClient, InMemoryCache } from "@apollo/client";

import { HttpLink } from "@apollo/client/link/http";
import { SetContextLink } from "@apollo/client/link/context";
import { ApolloProvider } from "@apollo/client/react";

const authLink = new SetContextLink((prevContext) => {
  const token = localStorage.getItem("phonenumbers-user-token");

  return {
    headers: {
      ...prevContext.headers,
      authorization: token ? `Bearer ${token}` : null,
    },
  };
});

const httpLink = new HttpLink({
  uri: "http://localhost:4000",
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </StrictMode>
);
