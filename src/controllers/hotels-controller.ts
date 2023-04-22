import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import hotelsService from '@/services/hotels-service';

export async function getHotels(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try {
    const hotels = hotelsService.getHotels(userId);
    return res.status(httpStatus.OK).send(hotels);
  } catch (error) {
    if (error.name === 'NotFoundError') {
      res.sendStatus(httpStatus.NOT_FOUND);
    } else if (error.name === 'PaymentRequiredError') {
      res.sendStatus(httpStatus.PAYMENT_REQUIRED);
    }
  }
}
