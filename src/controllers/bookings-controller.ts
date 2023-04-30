import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import bookingsService from '@/services/bookings-service';

export async function getUserBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try {
    const userBooking = await bookingsService.getUserBooking(userId);
    return res.status(httpStatus.OK).send(userBooking);
  } catch (error) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

// export async function addBooking(req: AuthenticatedRequest, res: Response) {
//     let { userId } = req;

//     try {

//     } catch (error) {

//     }
// }

// export async function changeBooking(req: AuthenticatedRequest, res: Response) {
//     let { userId } = req;

//     try {

//     } catch (error) {

//     }
// }
