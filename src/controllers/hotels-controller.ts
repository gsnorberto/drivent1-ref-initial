import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import hotelsService from '@/services/hotels-service';

export async function getHotels(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try {
    const hotels = await hotelsService.getHotels(userId);
    return res.status(httpStatus.OK).send(hotels);
  } catch (error) {
    if (error.name === 'NotFoundError') {
      res.sendStatus(httpStatus.NOT_FOUND);
    } else if (error.name === 'PaymentRequiredError') {
      res.sendStatus(httpStatus.PAYMENT_REQUIRED);
    }
  }
}

export async function getHotelRooms(req: AuthenticatedRequest, res: Response) {
  const hotelId: number = +req.params.hotelId;
  const { userId } = req;

  try {
    const hotels = await hotelsService.getHotelRooms(userId, hotelId);
    return res.status(httpStatus.OK).send(hotels);
  } catch (error) {
    if (error.name === 'NotFoundError') {
      res.sendStatus(httpStatus.NOT_FOUND);
    } else if (error.name === 'PaymentRequiredError') {
      res.sendStatus(httpStatus.PAYMENT_REQUIRED);
    }
  }
}
