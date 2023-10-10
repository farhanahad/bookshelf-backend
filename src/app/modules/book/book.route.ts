import express from 'express';
import validateRequest from '../../middlewares/validationRequest';
import { BookValidation } from './book.validation';
import { BookController } from './book.controller';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post(
  '/',
  validateRequest(BookValidation.createBookZodSchema),
  auth(),
  BookController.insertBookToDB
);

router.get('/:id', BookController.getSingleBookFromDB);

router.patch(
  '/:id',
  validateRequest(BookValidation.updateBookZodSchema),
  auth(),
  BookController.updateBookFromDB
);

router.delete('/:id', auth(), BookController.deleteBookFromDB);

router.get('/', BookController.getAllBooksFromDB);

export const BookRoutes = router;
