import { Router } from 'express';
import { getTicketTypes, getUserTickets } from '@/controllers/tickets-controller';
import { authenticateToken } from '@/middlewares';

const ticketsRouter = Router();

ticketsRouter.get('/types', authenticateToken, getTicketTypes);
ticketsRouter.get('/', authenticateToken, getUserTickets);
// ticketsRouter.post('/');

export { ticketsRouter };
