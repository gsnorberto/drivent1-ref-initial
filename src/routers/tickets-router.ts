import { Router } from 'express';
import { getTicketTypes } from '@/controllers/tickets-controller';
import { authenticateToken } from '@/middlewares';

const ticketsRouter = Router();

ticketsRouter.get('/types', authenticateToken, getTicketTypes);
// ticketsRouter.get('/');
// ticketsRouter.post('/');

export { ticketsRouter };
