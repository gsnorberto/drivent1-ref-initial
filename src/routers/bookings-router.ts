import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { addBooking, changeBooking, getUserBooking } from '@/controllers';
import { addBookingSchema } from '@/schemas';

const bookingsRouter = Router();

bookingsRouter
  .get('/', authenticateToken, getUserBooking)
  .post('/', authenticateToken, validateBody(addBookingSchema), addBooking)
  .put('/:bookingId', authenticateToken, validateBody(addBookingSchema), changeBooking);

export { bookingsRouter };
