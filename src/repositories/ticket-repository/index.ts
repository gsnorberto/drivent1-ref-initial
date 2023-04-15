import { prisma } from '@/config';

async function getTicketTypes() {
  return prisma.ticketType.findMany();
}

async function getUserTickets(enrollmentId: number) {
  return prisma.ticket.findFirst({
    where: { enrollmentId },
    include: { TicketType: true },
  });
}

async function createTicket(ticketTypeId: number, enrollmentId: number) {
  return prisma.ticket.create({
    data: { status: 'RESERVED', ticketTypeId, enrollmentId },
  });
}

const ticketRepository = {
  getTicketTypes,
  getUserTickets,
  createTicket,
};

export default ticketRepository;
