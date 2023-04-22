import { Router } from 'express';
import { authenticateToken, validateParams } from '@/middlewares';
import { createHotelSchema } from '@/schemas';
import { getHotels, getHotelRooms } from '@/controllers';

const hotelsRouter = Router();

hotelsRouter.get('/', authenticateToken, getHotels);
hotelsRouter.post('/:hotelId', authenticateToken, validateParams(createHotelSchema), getHotelRooms);

export { hotelsRouter };
