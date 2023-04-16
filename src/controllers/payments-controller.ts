import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import paymentsService from '@/services/payments-service';
import { PaymentGeneralData } from '@/protocols/payment';

export async function getPaymentInformation(req: AuthenticatedRequest, res: Response) {
  const ticketId = Number(req.query.ticketId);
  const { userId } = req;

  try {
    const paymentInformation = await paymentsService.getPaymentInformation(ticketId, userId);

    return res.status(httpStatus.OK).send(paymentInformation);
  } catch (error) {
    if (error.name === 'NotFoundError') {
      res.sendStatus(httpStatus.NOT_FOUND);
    } else if (error.name === 'UnauthorizedError') {
      res.sendStatus(httpStatus.UNAUTHORIZED);
    }
  }
}

export async function makePayment(req: AuthenticatedRequest, res: Response) {
  const paymentData: PaymentGeneralData = req.body;
  const { userId } = req;

  try {
    const paymentInfos = await paymentsService.makePayment(paymentData, userId);

    return res.status(httpStatus.OK).send(paymentInfos);
  } catch (error) {
    if (error.name === 'NotFoundError') {
      res.sendStatus(httpStatus.NOT_FOUND);
    } else if (error.name === 'UnauthorizedError') {
      res.sendStatus(httpStatus.UNAUTHORIZED);
    }
  }
}
