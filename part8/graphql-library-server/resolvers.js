const Book = require("./models/book");
const Author = require("./models/author");
const User = require("./models/user");
const { GraphQLError } = require("graphql");
const jwt = require("jsonwebtoken");

const { PubSub } = require("graphql-subscriptions");

const pubsub = new PubSub();

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
      return filteredBooks;
    },
    allAuthors: async () => {
      console.log("find authors");
      return Author.find({});
    },
    me: async (root, args, context) => {
      return context.currentUser;
    },
    allGenres: async () => await Book.distinct("genres"),
  },
  Author: {
    bookCount: async (root) => {
      console.log("find count", root.books.length);
      return root.books.length;
      // return Book.countDocuments({ author: root._id });
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
      const populatedBook = await book.populate("author");
      pubsub.publish("BOOK_ADDED", { bookAdded: populatedBook });
      return populatedBook;
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
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterableIterator("BOOK_ADDED"),
    },
  },
};

module.exports = resolvers;
