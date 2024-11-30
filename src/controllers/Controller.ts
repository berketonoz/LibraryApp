import { Request, Response, NextFunction } from 'express';
import { User, Book, Borrow } from '../models/associations';

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
      const responseBody = formatResponseBody('Getting user list with ids and names', req, res, users);

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
