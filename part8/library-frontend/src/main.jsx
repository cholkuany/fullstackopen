import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { ApolloClient, HttpLink, ApolloLink, InMemoryCache } from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { SetContextLink } from "@apollo/client/link/context";
import { ApolloProvider } from "@apollo/client/react";
import { OperationTypeNode } from "graphql";

import App from "./App.jsx";

const auth = new SetContextLink((prevContext, operation) => {
  const token = localStorage.getItem("currentUser-token");

  return {
    headers: {
      ...prevContext.headers,
      authorization: token ? `Bearer ${token}` : null,
    },
  };
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: "http://localhost:4000/",
  })
);

const httpLink = new HttpLink({
  uri: "http://localhost:4000/",
});

const splitLink = ApolloLink.split(
  ({ operationType }) => {
    return operationType === OperationTypeNode.SUBSCRIPTION;
  },
  wsLink,
  auth.concat(httpLink)
);


const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </StrictMode>
);
