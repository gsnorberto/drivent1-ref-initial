import { Router } from 'express';
import { authenticateToken, validateBody, validateParams } from '@/middlewares';
import { addBooking, changeBooking, getUserBooking } from '@/controllers';
import { addBookingSchema, changeBookingSchema } from '@/schemas';

const bookingsRouter = Router();

bookingsRouter
  .get('/', authenticateToken, getUserBooking)
  .post('/', authenticateToken, validateBody(addBookingSchema), addBooking)
  .put(
    '/:bookingId',
    authenticateToken,
    validateParams(changeBookingSchema),
    validateBody(addBookingSchema),
    changeBooking,
  );

export { bookingsRouter };
