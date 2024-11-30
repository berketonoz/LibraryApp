import { Request, Response, NextFunction } from 'express';
import { User, Book, Borrow } from '../models/associations';
import { Op } from 'sequelize';

// write me a function to get the response body from the request and response in the format below
function formatResponseBody(
  name: string,
  req: Request,
  res: Response,
  body: any = null,
) {
  return {
    name: name,
    originalRequest: {
      method: req.method,
      header: req.headers,
      url: req.originalUrl,
    },
    status: res.statusCode === 200 ? 'OK' : 'Error',
    code: res.statusCode,
    body: JSON.stringify(body, null, 4),
  };
}

class Controller {
  static async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await User.findAll({
        attributes: ['id', 'name'],
        raw: true,
      });

      // Construct the response body to include originalRequest
      const responseBody = formatResponseBody(
        'Getting user list with ids and names',
        req,
        res,
        users,
      );

      res.json(responseBody);
    } catch (error) {
      next(error);
    }
  }

  static async getUser(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;

      // Fetch user along with their borrow history
      const user = await User.findByPk(id, {
        attributes: ['id', 'name'],
        include: [
          {
            model: Borrow,
            as: 'borrows',
            include: [
              {
                model: Book,
                as: 'book',
                attributes: ['name'],
              },
            ],
          },
        ],
      });

      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      // Separate borrows into past and present
      const pastBorrows: any[] = [];
      const presentBorrows: any[] = [];

      user.borrows?.forEach((borrow) => {
        if (borrow.return_date) {
          pastBorrows.push({
            name: borrow.book!.name,
            userScore: borrow.user_score,
          });
        } else {
          presentBorrows.push({
            name: borrow.book!.name,
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

      const name =
        pastBorrows.length === 0 && presentBorrows.length === 0
          ? 'Getting a user with no borrow history'
          : 'Getting a user with his past and current book borrow list';

      // Construct the response body to include originalRequest
      const responseBody = formatResponseBody(
        name,
        req,
        res,
        JSON.stringify(userResponse),
      );

      res.json(responseBody);
    } catch (error) {
      console.error('Error fetching user details:', error);
      res.status(500).json({ error: 'Failed to fetch user details' });
    }
  }

  static async getBooks(req: Request, res: Response, next: NextFunction) {
    try {
      const books = await Book.findAll({ attributes: ['id', 'name'] });

      const responseBody = formatResponseBody(
        'Getting book list',
        req,
        res,
        books,
      );

      res.json(responseBody);
    } catch (error) {
      console.error('Error fetching books:', error);
      res.status(500).json({ error: 'Failed to fetch books' });
    }
  }

  static async getBook(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const book = await Book.findByPk(id, {
        attributes: ['id', 'name', 'average_score'],
      });

      if (!book) {
        res.status(404).json({ error: 'Book not found' });
        return;
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
          ? 'Getting a book which is not scored yet'
          : 'Getting a book with its average user score';

      // Construct the response body to include originalRequest
      const responseBody = {
        name: responseName,
        originalRequest: {
          method: req.method,
          header: req.headers,
          url: req.originalUrl,
        },
        status: res.statusCode === 200 ? 'OK' : 'Error',
        code: res.statusCode,
        body: JSON.stringify(bookResponse, null, 4),
      };

      res.json(responseBody);
    } catch (error) {
      next(error);
    }
  }

  static async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      // Validate request body
      // Create new user
      await User.create(req.body);
      // Construct the response body to include originalRequest
      const responseBody = formatResponseBody('Creating a user', req, res);

      res.status(201).json(responseBody);
      return;
    } catch (error) {}
  }

  static async createBook(req: Request, res: Response, next: NextFunction) {
    try {
      // Validate request body
      // Create new user
      await Book.create(req.body);
      // Construct the response body to include originalRequest
      const responseBody = formatResponseBody('Creating a book', req, res);

      res.status(201).json(responseBody);
      return;
    } catch (error) {
      next(error);
    }
  }

  static async borrowBook(req: Request, res: Response, next: NextFunction) {
    try {
      // Implement borrow logic
      const userId = req.params.user_id;
      const bookId = req.params.book_id;

      // Check if user exists
      const user = await User.findByPk(userId);
      if (!user) {
        res.status(500).json({ error: 'User not found' });
        return;
      }

      // Check if book exists
      const book = await Book.findByPk(bookId);
      if (!book) {
        res.status(500).json({ error: 'Book not found' });
        return;
      }

      // Check if the book is already borrowed
      const existingBorrow = await Borrow.findOne({
        where: {
          book_id: bookId,
          return_date: null,
        },
      });
      if (existingBorrow) {
        res.status(500).json({ error: 'Book is already borrowed' });
        return;
      }

      await Borrow.create({
        user_id: userId,
        book_id: bookId,
      });

      // Construct the response body to include originalRequest
      const responseBody = formatResponseBody(
        'User borrowed a book successfully',
        req,
        res,
      );

      res.status(200).json(responseBody); // Changed to 200 due to 204 not returning a body !
      return;
    } catch (error) {
      next(error);
    }
  }

  static async returnBook(req: Request, res: Response, next: NextFunction) {
    try {
      const { score } = req.body;
      const userId = parseInt(req.params.user_id);
      const bookId = parseInt(req.params.book_id);

      // Check if user exists
      const user = await User.findByPk(userId);
      if (!user) {
        res.status(500).json({ error: 'User not found' });
        return;
      }

      // Check if book exists
      const book = await Book.findByPk(bookId);
      if (!book) {
        res.status(500).json({ error: 'Book not found' });
        return;
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
        res
          .status(500)
          .json({ error: 'Borrow record not found or book already returned' });
        return;
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
          0,
        );
        const averageScore = totalScore / borrows.length;

        book.average_score = averageScore;
        await book.save();
      }

      const responseBody = formatResponseBody(
        'User returning a book with his score',
        req,
        res,
      );

      res.status(200).json(responseBody);
    } catch (error) {
      next(error);
    }
  }
}

export default Controller;
