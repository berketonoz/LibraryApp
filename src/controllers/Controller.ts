import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import Book from '../models/Book';
import Borrow from '../models/Borrow';

class Controller {
  static async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await User.findAll({
        attributes: ['id', 'name'],
        raw: true,
      });

      // Construct the response body to include originalRequest
      const responseBody = {
        name: 'Getting user list with ids and names',
        originalRequest: {
          method: req.method,
          header: req.headers,
          url: req.originalUrl,
        },
        status: res.statusCode === 200 ? 'OK' : 'Error',
        code: res.statusCode,
        header: res.getHeaders(),
        cookies: res.getHeaders()['set-cookie'],
        body: JSON.stringify(users, null, 4),
      };

      res.json(responseBody);
    } catch (error) {
      next(error);
    }
  }

  static async getUser(req: Request, res: Response, next: NextFunction) {
    // Implement fetching user with past and present books
  }

  static async getBooks(req: Request, res: Response, next: NextFunction) {
    const books = await Book.findAll({ attributes: ['id', 'name'] });
    res.status(200).json(books);
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

  static async createUser(req: Request, res: Response) {
    // Validate request body
    // Create new user
  }

  static async createBook(req: Request, res: Response) {
    // Validate request body
    // Create new user
  }

  static async borrowBook(req: Request, res: Response) {
    // Implement borrow logic
  }

  static async returnBook(req: Request, res: Response) {
    // Implement return logic
  }
}

export default Controller;
