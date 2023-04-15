import { Router } from 'express';
import { getTicketTypes, getUserTickets, createTicket } from '@/controllers/tickets-controller';
import { authenticateToken, validateBody } from '@/middlewares';
import { createTickedSchema } from '@/schemas';

const ticketsRouter = Router();

ticketsRouter.get('/types', authenticateToken, getTicketTypes);
ticketsRouter.get('/', authenticateToken, getUserTickets);
ticketsRouter.post('/', authenticateToken, validateBody(createTickedSchema), createTicket);

export { ticketsRouter };
