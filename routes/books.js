// Import required packages
const express = require("express");
const router = express.Router();
const axios = require("axios");

// This function fetches the book cover from Open Library API using the ISBN
async function getBookCover(isbn) {
  if (!isbn) return null;
  try {
    const url = `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`;
    await axios.get(url);
    return url;
  } catch (err) {
    console.error("Error fetching book cover:", err);
    return null;
  }
}

// GET - Display all books
router.get("/", async (req, res) => {
  try {
    const sort = req.query.sort || "recency";
    let orderBy = "date_read DESC";
    if (sort === "rating") orderBy = "rating DESC";
    if (sort === "title") orderBy = "title ASC";

    const result = await req.db.query(`SELECT * FROM books ORDER BY ${orderBy}`);
    const books = result.rows;

    const booksWithCovers = await Promise.all(
      books.map(async (book) => {
        const cover = await getBookCover(book.isbn);
        return { ...book, cover };
      })
    );

    res.render("index", { books: booksWithCovers, sort });
  } catch (err) {
    console.error("Error fetching books:", err);
    res.status(500).send("Error fetching books");
  }
});

// GET - Show form to add a new book
router.get("/add", (req, res) => {
  res.render("add");
});

// POST - Add a new book to the database
router.post("/add", async (req, res) => {
  try {
    const { title, author, rating, date_read, notes, isbn } = req.body;
    await req.db.query(
      "INSERT INTO books (title, author, rating, date_read, notes, isbn) VALUES ($1, $2, $3, $4, $5, $6)",
      [title, author, rating, date_read, notes, isbn]
    );
    res.redirect("/");
  } catch (err) {
    console.error("Error adding book:", err);
    res.status(500).send("Error adding book");
  }
});

// GET - Show form to edit a book
router.get("/edit/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await req.db.query("SELECT * FROM books WHERE id = $1", [id]);
    const book = result.rows[0];
    res.render("edit", { book });
  } catch (err) {
    console.error("Error fetching book:", err);
    res.status(500).send("Error fetching book");
  }
});

// POST - Update a book in the database
router.post("/edit/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, rating, date_read, notes, isbn } = req.body;
    await req.db.query(
      "UPDATE books SET title=$1, author=$2, rating=$3, date_read=$4, notes=$5, isbn=$6 WHERE id=$7",
      [title, author, rating, date_read, notes, isbn, id]
    );
    res.redirect("/");
  } catch (err) {
    console.error("Error updating book:", err);
    res.status(500).send("Error updating book");
  }
});

// POST - Delete a book from the database
router.post("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await req.db.query("DELETE FROM books WHERE id = $1", [id]);
    res.redirect("/");
  } catch (err) {
    console.error("Error deleting book:", err);
    res.status(500).send("Error deleting book");
  }
});

module.exports = router;