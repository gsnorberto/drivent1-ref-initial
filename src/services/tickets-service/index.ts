import { TicketType } from '@prisma/client';
import { notFoundError } from '@/errors';
import ticketRepository from '@/repositories/ticket-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';

async function getTicketTypes(): Promise<TicketType[]> {
  const ticketTypes = await ticketRepository.getTicketTypes();

  if (!ticketTypes) throw notFoundError;

  return ticketTypes;
}

async function getUserTickets(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError;

  const tickets = await ticketRepository.getUserTickets(enrollment.id);
  if (!tickets) throw notFoundError;

  return tickets;
}

const ticketsService = {
  getTicketTypes,
  getUserTickets,
};

export default ticketsService;
