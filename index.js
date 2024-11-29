import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url"; // Import this to work with import.meta.url
import { sequelize, User, Book, Borrow } from "./sequelize.js";

// Create __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.json());

// File paths for mock data
const collectionPath = path.join(
  __dirname,
  "./Library Case API Collection.postman_collection.json"
);
const collection = JSON.parse(fs.readFileSync(collectionPath, "utf8"));

app.get("/test/collection/:id", (req, res) => {
  const id = req.params.id;
  res.json(JSON.parse(collection.item[id].response[0].body));
});

// Routes
app.get("/users", async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

app.get("/users/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findByPk(id);
    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

app.get("/books", async (req, res) => {
  try {
    const books = await Book.findAll();
    res.json(books);
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ error: "Failed to fetch books" });
  }
});

app.get("/books/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const book = await Book.findByPk(id);
    res.json(book);
  } catch (error) {
    console.error("Error fetching book:", error);
    res.status(500).json({ error: "Failed to fetch book" });
  }
});

app.post("/users", async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({
      message: "User created successfully",
      user,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
});

app.post("/books", async (req, res) => {
  try {
    const book = await Book.create(req.body);
    res.status(201).json({
      message: "Book created successfully",
      book,
    });
  } catch (error) {
    console.error("Error creating book:", error);
    res.status(500).json({ error: "Failed to create book" });
  }
});

// Sync database and start server
sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Database synced successfully");
    app.listen(port, () => {
      console.log(`Library management app listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to sync database:", error);
  });
