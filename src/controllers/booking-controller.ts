import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import bookingService from '@/services/booking-service';

export async function getUserBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try {
    const userBooking = await bookingService.getUserBooking(userId);
    return res.status(httpStatus.OK).send(userBooking);
  } catch (error) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function addBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const roomId: number = +req.body.roomId;

  try {
    const booking = await bookingService.addBooking(userId, roomId);
    return res.status(httpStatus.OK).send(booking);
  } catch (error) {
    if (error.name === 'ForbiddenError') {
      res.status(httpStatus.FORBIDDEN).send(error.message);
    } else if (error.name === 'NotFoundError') {
      res.status(httpStatus.NOT_FOUND).send(error.message);
    }
  }
}

export async function changeBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const roomId: number = +req.body.roomId;
  const bookingId: number = +req.params.bookingId;

  try {
    const booking = await bookingService.changeBooking(userId, roomId, bookingId);
    return res.status(httpStatus.OK).send(booking);
  } catch (error) {
    if (error.name === 'ForbiddenError') {
      res.status(httpStatus.FORBIDDEN).send(error.message);
    } else if (error.name === 'NotFoundError') {
      res.status(httpStatus.NOT_FOUND).send(error.message);
    }
  }
}
