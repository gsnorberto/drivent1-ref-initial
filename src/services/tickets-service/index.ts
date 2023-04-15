import { TicketType } from '@prisma/client';
import { notFoundError } from '@/errors';
import ticketRepository from '@/repositories/ticket-repository';

async function getTicketTypes(): Promise<TicketType[]> {
  const ticketTypes = await ticketRepository.getTicketTypes();

  if (!ticketTypes) throw notFoundError;

  return ticketTypes;
}

const ticketsService = {
  getTicketTypes,
};

export default ticketsService;
