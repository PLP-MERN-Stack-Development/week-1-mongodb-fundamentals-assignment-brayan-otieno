use plp_bookstore;

// --- Task 2: Basic CRUD Operations ---

// 1. Find all books in genre "Fiction"
db.books.find({ genre: "Fiction" }).pretty();

// 2. Find books published after 1950
db.books.find({ published_year: { $gt: 1950 } }).pretty();

// 3. Find books by author "George Orwell"
db.books.find({ author: "George Orwell" }).pretty();

// 4. Update the price of "The Alchemist" to 12.99
db.books.updateOne(
  { title: "The Alchemist" },
  { $set: { price: 12.99 } }
);

// 5. Delete the book titled "Moby Dick"
db.books.deleteOne({ title: "Moby Dick" });

// --- Task 3: Advanced Queries ---

// Find books that are in stock and published after 2010
db.books.find({ in_stock: true, published_year: { $gt: 2010 } }).pretty();

// Projection: only title, author, and price
db.books.find({}, { title: 1, author: 1, price: 1, _id: 0 }).pretty();

// Sort books by price ascending
db.books.find().sort({ price: 1 }).pretty();

// Sort books by price descending
db.books.find().sort({ price: -1 }).pretty();

// Pagination - Page 1 (first 5 books)
db.books.find().skip(0).limit(5).pretty();

// Pagination - Page 2 (next 5 books)
db.books.find().skip(5).limit(5).pretty();

// --- Task 4: Aggregation Pipeline ---

// Average price by genre
db.books.aggregate([
  { $group: { _id: "$genre", avgPrice: { $avg: "$price" } } }
]);

// Author with the most books
db.books.aggregate([
  { $group: { _id: "$author", count: { $sum: 1 } } },
  { $sort: { count: -1 } },
  { $limit: 1 }
]);

// Group books by publication decade and count
db.books.aggregate([
  {
    $group: {
      _id: {
        $concat: [
          { $toString: { $subtract: [ "$published_year", { $mod: [ "$published_year", 10 ] } ] } },
          "s"
        ]
      },
      count: { $sum: 1 }
    }
  }
]);

// --- Task 5: Indexing ---

// Create an index on title for faster search
db.books.createIndex({ title: 1 });

// Create compound index on author and published_year
db.books.createIndex({ author: 1, published_year: -1 });

// Use explain() to check index usage on a query
db.books.find({ title: "The Hobbit" }).explain("executionStats");
