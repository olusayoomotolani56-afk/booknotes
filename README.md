# 📚 BookNotes

A personal book notes web application where you can track books you have read, add ratings, notes and view book covers.

## Technologies Used

- Node.js
- Express.js
- PostgreSQL (Supabase)
- EJS Templating Engine
- Axios
- Open Library Covers API

## How to Run

### 1. Clone the repository

git clone <your-repo-url>

### 2. Install dependencies

npm install

### 3. Set up environment variables

Create a `.env` file in the root folder and add:
DATABASE_URL=your_supabase_connection_string

### 4. Start the server

npm start

### 5. Open in browser

http://localhost:3000

## Features

- Add, edit and delete books
- View book covers fetched from Open Library API
- Sort books by rating, recency or title
- Store all data in PostgreSQL database

## API Endpoints

| Method | Endpoint    | Description         |
| ------ | ----------- | ------------------- |
| GET    | /           | Get all books       |
| GET    | /add        | Show add book form  |
| POST   | /add        | Add a new book      |
| GET    | /edit/:id   | Show edit book form |
| POST   | /edit/:id   | Update a book       |
| POST   | /delete/:id | Delete a book       |
