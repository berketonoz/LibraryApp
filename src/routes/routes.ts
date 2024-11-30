import express from 'express';
import Controller from '../controllers/Controller';

const router = express.Router();

router.get('/users', Controller.getUsers);
router.get('/users/:id', Controller.getUser);
router.get('/books', Controller.getBooks);
router.get('/books/:id', Controller.getBook);
router.post('/users', Controller.createUser);
router.post('/books', Controller.createBook);
router.post('/users/:id/borrow/:bookId', Controller.borrowBook);
router.post('/users/:id/return/:bookId', Controller.returnBook);

export default router;
