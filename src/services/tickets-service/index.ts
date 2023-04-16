import { TicketType, Ticket } from '@prisma/client';
import { notFoundError } from '@/errors';
import ticketRepository from '@/repositories/ticket-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';

async function getTicketTypes(): Promise<TicketType[]> {
  const ticketTypes = await ticketRepository.getTicketTypes();

  if (!ticketTypes) throw notFoundError();

  return ticketTypes;
}

async function getUserTickets(userId: number): Promise<
  Ticket & {
    TicketType: TicketType;
  }
> {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();

  const tickets = await ticketRepository.getUserTickets(enrollment.id);
  if (!tickets) throw notFoundError();

  return tickets;
}

async function createTicket(
  ticketTypeId: number,
  userId: number,
): Promise<
  Ticket & {
    TicketType: TicketType;
  }
> {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();

  await ticketRepository.createTicket(ticketTypeId, enrollment.id);

  const userTicket = await ticketRepository.getUserTickets(enrollment.id);

  if (!userTicket) throw notFoundError();

  return userTicket;
}

const ticketsService = {
  getTicketTypes,
  getUserTickets,
  createTicket,
};

export default ticketsService;
