/* import express from "express";
import path from "path";
import { fileURLToPath } from "url"; // Import this to work with import.meta.url
import { sequelize, User, Book, Borrow } from "./src/config/database.ts";
import { Op } from "sequelize";

// Create __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.json());

// Routes
app.get("/users", async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "name"],
      raw: true,
    });

    // Construct the response body to include originalRequest
    const responseBody = {
      name: "Getting user list with ids and names",
      originalRequest: {
        method: req.method,
        header: req.headers,
        url: req.originalUrl,
      },
      status: res.statusCode === 200 ? "OK" : "Error",
      code: res.statusCode,
      header: res.getHeaders(),
      cookies: res.getHeaders()["set-cookie"],
      body: JSON.stringify(users, null, 4),
    };

    res.json(responseBody);
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
      attributes: ["id", "name"],
      include: [
        {
          model: Borrow,
          as: "borrows",
          include: [
            {
              model: Book,
              as: "book",
              attributes: ["name"],
            },
          ],
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

    // Format the response to match the Postman Collection example
    const userResponse = {
      id: user.id,
      name: user.name,
      books: {
        past: pastBorrows,
        present: presentBorrows,
      },
    };

    // Construct the response body to include originalRequest
    const responseBody = {
      name: "Get User",
      request: {
        method: req.method,
        header: req.headers,
        url: req.originalUrl,
      },
      response: [
        {
          name:
            pastBorrows.length === 0 && presentBorrows.length === 0
              ? "Getting a user with no borrow history"
              : "Getting a user with his past and current book borrow list",
          originalRequest: {
            method: req.method,
            header: req.headers,
            url: req.originalUrl,
          },
          status: res.statusCode === 200 ? "OK" : "Error",
          code: res.statusCode,
          body: JSON.stringify(userResponse, null, 4),
        },
      ],
    };

    res.json(responseBody);
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ error: "Failed to fetch user details" });
  }
});

app.post("/users", async (req, res) => {
  try {
    await User.create(req.body);
    // Construct the response body to include originalRequest
    const responseBody = {
      name: "Create User",
      request: {
        method: req.method,
        header: req.headers,
        url: req.originalUrl,
        body: req.body,
      },
      response: [
        {
          name: "Creating a user",
          originalRequest: {
            method: req.method,
            header: req.headers,
            url: req.originalUrl,
            body: req.body,
          },
          code: 201,
          body: "",
        },
      ],
    };

    res.status(201).json(responseBody);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
});

app.get("/books", async (req, res) => {
  try {
    const books = await Book.findAll({
      attributes: ["id", "name"],
      raw: true,
    });

    // Construct the response body to include originalRequest
    const responseBody = {
      name: "Get Books",
      request: {
        method: req.method,
        header: req.headers,
        url: req.originalUrl,
      },
      response: [
        {
          name: "Getting book list",
          originalRequest: {
            method: req.method,
            header: req.headers,
            url: req.originalUrl,
          },
          status: res.statusCode === 200 ? "OK" : "Error",
          code: res.statusCode,
          body: JSON.stringify(books, null, 4),
        },
      ],
    };

    res.json(responseBody);
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ error: "Failed to fetch books" });
  }
});

app.get("/books/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const book = await Book.findByPk(id, {
      attributes: ["id", "name", "average_score"],
    });

    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    const score =
      book.average_score !== null
        ? parseFloat(book.average_score.toFixed(2))
        : -1;

    // Format the response to match the Postman Collection example
    const bookResponse = {
      id: book.id,
      name: book.name,
      score: score,
    };

    // Determine the appropriate response name based on the score
    const responseName =
      score === -1
        ? "Getting a book which is not scored yet"
        : "Getting a book with its average user score";

    // Construct the response body to include originalRequest
    const responseBody = {
      name: "Get Book",
      request: {
        method: req.method,
        header: req.headers,
        url: req.originalUrl,
      },
      response: [
        {
          name: responseName,
          originalRequest: {
            method: req.method,
            header: req.headers,
            url: req.originalUrl,
          },
          status: res.statusCode === 200 ? "OK" : "Error",
          code: res.statusCode,
          body: JSON.stringify(bookResponse, null, 4),
        },
      ],
    };

    res.json(responseBody);
  } catch (error) {
    console.error("Error fetching book:", error);
    res.status(500).json({ error: "Failed to fetch book" });
  }
});

app.post("/books", async (req, res) => {
  try {
    await Book.create(req.body);
    // Construct the response body to include originalRequest
    const responseBody = {
      name: "Create Book",
      request: {
        method: req.method,
        header: req.headers,
        url: req.originalUrl,
        body: req.body,
      },
      response: [
        {
          name: "Creating a book",
          originalRequest: {
            method: req.method,
            header: req.headers,
            url: req.originalUrl,
            body: req.body,
          },
          code: 201,
          body: "",
        },
      ],
    };

    res.status(201).json(responseBody);
  } catch (error) {
    console.error("Error creating book:", error);
    res.status(500).json({ error: "Failed to create book" });
  }
});

app.post("/users/:user_id/borrow/:book_id", async (req, res) => {
  try {
    const userId = req.params.user_id;
    const bookId = req.params.book_id;

    // Check if user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(500).json({ error: "User not found" });
    }

    // Check if book exists
    const book = await Book.findByPk(bookId);
    if (!book) {
      return res.status(500).json({ error: "Book not found" });
    }

    // Check if the book is already borrowed
    const existingBorrow = await Borrow.findOne({
      where: {
        book_id: bookId,
        return_date: null,
      },
    });
    if (existingBorrow) {
      return res.status(500).json({ error: "Book is already borrowed" });
    }

    await Borrow.create({
      user_id: userId,
      book_id: bookId,
    });

    // Construct the response body to include originalRequest
    const responseBody = {
      name: "Borrow Book",
      request: {
        method: req.method,
        header: req.headers,
        url: req.originalUrl,
      },
      response: [
        {
          name: "User borrowed a book successfully",
          originalRequest: {
            method: req.method,
            header: req.headers,
            url: req.originalUrl,
          },
          status: "No Content",
          code: 204,
          body: null,
        },
      ],
    };

    res.status(204).json(responseBody);
  } catch (error) {
    console.error("Error borrowing book:", error);
    res.status(500).json({ error: "Failed to borrow book" });
  }
});

app.post("/users/:user_id/return/:book_id", async (req, res) => {
  try {
    const { score } = req.body;
    const userId = parseInt(req.params.user_id);
    const bookId = parseInt(req.params.book_id);

    // Check if user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(500).json({ error: "User not found" });
    }

    // Check if book exists
    const book = await Book.findByPk(bookId);
    if (!book) {
      return res.status(500).json({ error: "Book not found" });
    }

    // Find the borrow record
    const borrow = await Borrow.findOne({
      where: {
        user_id: userId,
        book_id: bookId,
        return_date: null,
      },
    });
    if (!borrow) {
      return res
        .status(500)
        .json({ error: "Borrow record not found or book already returned" });
    }

    borrow.return_date = new Date();
    borrow.user_score = score;
    await borrow.save();

    // Update the book's average rating
    const borrows = await Borrow.findAll({
      where: { book_id: bookId, return_date: { [Op.ne]: null } },
    });

    if (borrows.length > 0) {
      const totalScore = borrows.reduce(
        (sum, borrow) => sum + borrow.user_score,
        0
      );
      const averageScore = totalScore / borrows.length;

      book.average_score = averageScore;
      await book.save();
    }

    // Construct the response body to include originalRequest
    const responseBody = {
      name: "Return Book",
      request: {
        method: req.method,
        header: req.headers,
        url: req.originalUrl,
        body: req.body,
      },
      response: [
        {
          name: "User returning a book with his score",
          originalRequest: {
            method: req.method,
            header: req.headers,
            url: req.originalUrl,
            body: req.body,
          },
          status: "No Content",
          code: 204,
          body: "",
        },
      ],
    };

    res.status(204).json(responseBody);
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
 */

  import express from 'express';
  import bodyParser from 'body-parser';
  import sequelize from './config/database';
  
  const app = express();
  app.use(bodyParser.json());
  
  // Import and use your routes
  import routes from './routes/routes';
  
  app.use('/', routes);
  
  // Error handling middleware
  import { errorHandler } from './middleware/errorHandler';
  app.use(errorHandler);
  
  const startServer = async () => {
    try {
      await sequelize.authenticate();
      console.log('Database connection established.');
  
      await sequelize.sync({ alter: true });
  
      app.listen(3000, () => {
        console.log('Server running on port 3000.');
      });
    } catch (err) {
      console.error('Unable to start the server:', err);
    }
  };
  
  startServer();
  
