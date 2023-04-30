import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getUserBooking } from '@/controllers';
import {} from '@/schemas';

const bookingsRouter = Router();

bookingsRouter.get('/', authenticateToken, getUserBooking).post('/').put('/:bookingId');

export { bookingsRouter };
