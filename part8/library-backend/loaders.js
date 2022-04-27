const Book = require("./models/book");

const batchBooks = async (authors) => {
  const books = await Book.find({
    author: { $in: authors },
  });
  return authors.map((author) =>
    books.filter((book) => book.author.equals(author))
  );
};

module.exports = { batchBooks };
