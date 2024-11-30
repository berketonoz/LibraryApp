import express from 'express';
import Controller from '../controllers/Controller';

const router = express.Router();

router.get('/users', Controller.getUsers);
router.get('/users/:id', Controller.getUser);
router.get('/books', Controller.getBooks);
router.get('/books/:id', Controller.getBook);
router.post('/users', Controller.createUser);
router.post('/books', Controller.createBook);
router.post('/users/:user_id/borrow/:book_id', Controller.borrowBook);
router.post('/users/:user_id/return/:book_id', Controller.returnBook);

export default router;
