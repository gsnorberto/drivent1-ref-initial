import { Response } from 'express';
import httpStatus from 'http-status';
import ticketsService from '@/services/tickets-service';
import { AuthenticatedRequest } from '@/middlewares';

export async function getTicketTypes(req: AuthenticatedRequest, res: Response) {
  try {
    const ticketTypes = await ticketsService.getTicketTypes();
    return res.status(httpStatus.OK).send(ticketTypes);
  } catch (error) {
    res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function getUserTickets(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  try {
    const tickets = await ticketsService.getUserTickets(userId);
    return res.status(httpStatus.OK).send(tickets);
  } catch (error) {
    res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function createTicket(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { ticketTypeId } = req.body;
  try {
    const tickets = await ticketsService.createTicket(ticketTypeId, userId);
    return res.status(httpStatus.CREATED).send(tickets);
  } catch (error) {
    res.sendStatus(httpStatus.NOT_FOUND);
  }
}
