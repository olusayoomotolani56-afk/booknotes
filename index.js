 // Import all required packages
const express = require("express");
const axios = require("axios");
const pg = require("pg");
const dotenv = require("dotenv");
const path = require("path");

// Load environment variables from .env file
dotenv.config();

// Create express app
const app = express();
const PORT = 3000;

// Set up EJS as the templating engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware to parse form data and serve static files
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Set up PostgreSQL connection using the .env file
const db = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Connect to the database
db.connect()
  .then(() => console.log("✅ Connected to the database"))
  .catch((err) => console.error("❌ Database connection error:", err));

// Make the database accessible to the routes
app.use((req, res, next) => {
  req.db = db;
  next();
});

// Import and use the books router
const booksRouter = require("./routes/books");
app.use("/", booksRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});