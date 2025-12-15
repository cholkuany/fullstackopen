const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { GraphQLError } = require("graphql");

const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const Book = require("./models/book");
const Author = require("./models/author");
const User = require("./models/user");

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

const typeDefs = /* GraphQL */ `
  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int!
  }

  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]!
    id: ID!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    me: User
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book
    editAuthor(name: String!, born: Int!): Author
    createUser(username: String!, favoriteGenre: String!): User
    login(username: String!, password: String!): Token
  }
`;

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      const query = {};

      if (args.genre) {
        query.genres = args.genre;
      }
      let filteredBooks = await Book.find(query).populate("author");

      if (args.author) {
        filteredBooks = filteredBooks.filter(
          (b) => b.author.name === args.author
        );
      }

      if (args.genre) {
        filteredBooks = filteredBooks.filter((b) =>
          b.genres.includes(args.genre)
        );
      }
      return filteredBooks;
    },
    allAuthors: async () => Author.find({}),
    me: async (root, args, context) => {
      return context.currentUser;
    },
  },
  Author: {
    bookCount: async (root) => {
      const author = await Author.find({ author: root.name });
      const numBooks = author
        ? await Book.countDocuments({ author: author._id })
        : 0;
      return numBooks;
    },
  },

  Mutation: {
    addBook: async (root, args, context) => {
      const currentUser = context.currentUser;
      if (!currentUser) {
        throw new GraphQLError("you must login", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      let author = await Author.findOne({ name: args.author });

      if (!author) {
        author = new Author({ name: args.author });
        try {
          await author.save();
        } catch (error) {
          throw new GraphQLError("Invalid input", {
            extensions: {
              code: "BAD_USER_INPUT",
              invalidArgs: args.author,
              error,
            },
          });
        }
      }

      let book = {};

      try {
        book = new Book({ ...args, author: author._id });
        await book.save();
      } catch (error) {
        throw new GraphQLError("Invalid user input", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.title,
            error,
          },
        });
      }
      return book.populate("author");
    },

    editAuthor: async (root, args, context) => {
      let editedAuthor = null;
      if (!context.currentUser) {
        throw new GraphQLError("you must login", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }
      try {
        const author = await Author.findOneAndUpdate(
          { name: args.name },
          { born: args.born },
          { new: true }
        );
        return author;
      } catch (error) {
        return editedAuthor;
      }
    },
    createUser: async (root, args) => {
      let user = {};
      try {
        user = new User({ ...args });
        await user.save();
      } catch (error) {
        throw new GraphQLError("Invalid user input", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.username,
            error,
          },
        });
      }
      return user;
    },

    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });
      if (!user || args.password !== "secret") {
        throw new GraphQLError("User not found", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }
      const userToken = {
        username: user.username,
        id: user._id,
      };
      const token = jwt.sign(userToken, process.env.JWT_SECRET);
      return { value: token };
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req, res }) => {
    const authorization = req ? req.headers.authorization : null;
    if (authorization && authorization.startsWith("Bearer ")) {
      const token = authorization.replace("Bearer ", "");
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const currentUser = await User.findById(decoded.id);
      return { currentUser };
    }
    return { currentUser: null };
  },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
