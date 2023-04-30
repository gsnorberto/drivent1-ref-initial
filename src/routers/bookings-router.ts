import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { addBooking, getUserBooking } from '@/controllers';
import { addBookingSchema } from '@/schemas';

const bookingsRouter = Router();

bookingsRouter
  .get('/', authenticateToken, getUserBooking)
  .post('/', authenticateToken, validateBody(addBookingSchema), addBooking)
  .put('/:bookingId');

export { bookingsRouter };
