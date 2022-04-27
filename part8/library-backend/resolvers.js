require("dotenv").config();
const { UserInputError, AuthenticationError } = require("apollo-server");
const { PubSub } = require("graphql-subscriptions");
const pubsub = new PubSub();

const jwt = require("jsonwebtoken");

const User = require("./models/user");
const Author = require("./models/author");
const Book = require("./models/book");

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      if (args.author) {
        const author = await Author.findOne({ name: args.author });
        if (author) {
          if (args.genre) {
            return Book.find({
              author: author.id,
              genres: { $in: [args.genre] },
            }).populate("author");
          } else {
            return Book.find({
              author: author.id,
            }).populate("author");
          }
        } else {
          return [];
        }
      }

      if (args.genre) {
        return Book.find({ genres: { $in: [args.genre] } }).populate("author");
      }

      return Book.find({}).populate("author");
    },
    allAuthors: async () => {
      return Author.find({});
    },
    me: (root, args, context) => {
      return context.currentUser;
    },
  },
  Author: {
    bookCount: async (root, args, { loaders }) => {
      const books = await loaders.books.load(root.id);
      return books.length;
    },
  },
  Mutation: {
    addBook: async (root, args, context) => {
      // check for logged in user
      if (!context.currentUser) {
        throw new AuthenticationError("not authenticated");
      }

      // if book exists, throw error
      const existingBook = await Book.findOne({ title: args.title });
      if (existingBook) {
        throw new UserInputError("book already exists", {
          invalidArgs: args.title,
        });
      }

      // if book's author doesn't exist, add it
      let author = await Author.findOne({ name: args.author });
      if (!author) {
        author = new Author({ name: args.author });
        try {
          await author.save();
        } catch (error) {
          throw new UserInputError(error.message, {
            invalidArgs: args,
          });
        }
      }

      // add new book
      const book = new Book({ ...args, author });
      try {
        await book.save();
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        });
      }

      // add new author if author doesn't currently exist
      if (await Author.findOne({ name: args.author.name })) {
        const author = new Author({ ...args.author });
        try {
          await author.save();
        } catch (error) {
          throw new UserInputError(error.message, {
            invalidArgs: args,
          });
        }
      }

      pubsub.publish("BOOK_ADDED", { bookAdded: book });

      return book;
    },
    editAuthor: async (root, args, context) => {
      // check for logged in user
      if (!context.currentUser) {
        throw new AuthenticationError("not authenticated");
      }

      // if author doesn't exist, throw error
      const author = await Author.findOne({ name: args.name });
      if (!author) {
        throw new UserInputError("author doesn't exist", {
          invalidArgs: args.title,
        });
      }
      author.born = args.setBornTo;

      try {
        await author.save();
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        });
      }

      return author;
    },
    createUser: async (root, args) => {
      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre,
      });

      try {
        await user.save();
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        });
      }
      return user;
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });

      if (!user || args.password !== "password") {
        throw new UserInputError("wrong credentials");
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) };
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(["BOOK_ADDED"]),
    },
  },
};

module.exports = resolvers;
