import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url"; // Import this to work with import.meta.url
import { sequelize, User, Book, Borrow } from "./sequelize.js";
import { Op } from "sequelize";


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

    // Fetch user along with their borrow history
    const user = await User.findByPk(id, {
      include: [
        {
          model: Borrow,
          as: "borrows",
          include: [{ model: Book, as: "book" }],
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Separate borrows into past and present
    const pastBorrows = [];
    const presentBorrows = [];

    user.borrows.forEach((borrow) => {
      if (borrow.return_date) {
        pastBorrows.push({
          name: borrow.book.name,
          userScore: borrow.user_score,
        });
      } else {
        presentBorrows.push({
          name: borrow.book.name,
        });
      }
    });

    // Format the response
    res.json({
      id: user.id,
      name: user.name,
      books: {
        past: pastBorrows,
        present: presentBorrows,
      },
    });
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ error: "Failed to fetch user details" });
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

app.post("/users/:user_id/borrow/:book_id", async (req, res) => {
  try {
    const borrow = await Borrow.create({
      user_id: req.params.user_id,
      book_id: req.params.book_id,
    });

    res.status(201).json({
      message: "Book borrowed successfully",
      borrow,
    });
  } catch (error) {
    console.error("Error creating book:", error);
    res.status(500).json({ error: "Failed to create book" });
  }
});

app.post("/users/:user_id/return/:book_id", async (req, res) => {
  try {
    const { mode, score } = req.body;
    const user_id = parseInt(req.params.user_id);
    const book_id = parseInt(req.params.book_id);
    const borrow = await Borrow.findOne({
      where: {
        user_id: user_id,
        book_id: book_id,
      },
    });
    if (!borrow) {
      return res.status(404).json({ error: "Borrow record not found" });
    }
    borrow.return_date = new Date();
    borrow.user_score = score;
    await borrow.save();

    // After returning a book, update the book's average rating
    const borrows = await Borrow.findAll({
      where: { book_id, return_date: { [Op.ne]: null } },
    });

    if (borrows.length === 0) return;
    
    const totalScore = borrows.reduce(
      (sum, borrow) => sum + borrow.user_score,
      0
    );
    const averageScore = totalScore / borrows.length;

    const book = await Book.findByPk(book_id);
    book.average_score = averageScore;
    await book.save();

    res.status(200).json({
      message: "Book returned successfully",
      borrow,
    });
  } catch (error) {
    console.error("Error returning book:", error);
    res.status(500).json({ error: "Failed to return book" });
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
