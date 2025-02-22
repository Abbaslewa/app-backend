import express from "express";
import { PORT, mongoDBURL } from "./config.js"; // Import config file
import mongoose from "mongoose";
import { book } from "./models/bookmodels.js"; // Import your book model

const app = express();

// Middleware to parse JSON (required to read request body)
app.use(express.json());

// Root route
app.get("/", (req, res) => {
  console.log(req);
  return res.status(200).send("Welcome to MERN stack tutorial");
});

// POST route to create a new book
app.post("/book", async (req, res) => {
  try {
    // Validate the request body
    if (!req.body.title || !req.body.author || !req.body.publishYear) {
      return res.status(400).send({
        message: "Send all required fields: title, author, publishYear",
      });
    }

    const newBook = {
      title: req.body.title,
      author: req.body.author,
      publishYear: req.body.publishYear,
    };

    const createdBook = await book.create(newBook); // Create a new book in the database
    return res.status(201).send(createdBook); // Send the created book back in the response
  } catch (error) {
    res.status(500).send({ message: error.message }); // Handle errors
  }
});

// GET route to fetch all books
app.get("/book", async (req, res) => {
  try {
    const books = await book.find({});
    return res.status(200).json({
      count: books.length,
      data: books,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

// GET route to fetch a book by its ID
app.get("/book/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const foundBook = await book.findById(id);
    if (!foundBook) {
      return res.status(404).send({ message: "Book not found" });
    }
    return res.status(200).json({ book: foundBook });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

// PUT route to update a book by its ID
app.put("/book/:id", async (req, res) => {
  try {
    // Validate the request body
    if (!req.body.title || !req.body.author || !req.body.publishYear) {
      return res.status(400).send({
        message: "Send all required fields: title, author, publishYear",
      });
    }

    const { id } = req.params;
    const result = await book.findByIdAndUpdate(id, req.body, { new: true });

    if (!result) {
      return res.status(404).json({ message: "Book not found" });
    }

    return res.status(200).send({ message: "Book updated successfully", book: result });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

// Connect to MongoDB and start the Express server
mongoose
  .connect(mongoDBURL)
  .then(() => {
    console.log("Connected to MongoDB successfully");

    app.listen(PORT, () => {
      console.log(`App is listening on port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err); // Handle connection errors
  });
