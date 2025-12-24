const { ApolloServer } = require("@apollo/server");

const { expressMiddleware } = require("@as-integrations/express5");
const cors = require("cors");
const express = require("express");

const { createServer } = require("http");
const {
  ApolloServerPluginDrainHttpServer,
} = require("@apollo/server/plugin/drainHttpServer");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const { WebSocketServer } = require("ws");
const { useServer } = require("graphql-ws/use/ws");

const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const User = require("./models/user");

const typeDefs = require("./schema.js");
const resolvers = require("./resolvers.js");

require("dotenv").config();
mongoose.set("strictQuery", false);

const MONGODB_URI = process.env.MONGODB_URI;

console.log("\nConnecting to", MONGODB_URI);
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log(`\n\nConnected to ${MONGODB_URI}`))
  .catch((error) => {
    console.log(`\nError connecting to ${MONGODB_URI}`);
  });

const start = async () => {
  const app = express();
  const httpServer = createServer(app);

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/",
  });

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  const serverCleanup = useServer({ schema }, wsServer);

  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });

  await server.start();

  app.use(
    "/",
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const authorization = req ? req.headers.authorization : null;
        if (authorization && authorization.startsWith("Bearer ")) {
          const token = authorization.replace("Bearer ", "");
          const decoded = jwt.verify(token, process.env.JWT_SECRET);

          const currentUser = await User.findById(decoded.id);
          return { currentUser };
        }
        return { currentUser: null };
      },
    })
  );

  const PORT = 4000;
  httpServer.listen(PORT, () => {
    console.log(`Server is now running on http://localhost:${PORT}/`);
  });
};
start();
