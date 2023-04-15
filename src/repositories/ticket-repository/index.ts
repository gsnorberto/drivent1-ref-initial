import { prisma } from '@/config';

async function getTicketTypes() {
  return prisma.ticketType.findMany();
}

const ticketRepository = {
  getTicketTypes,
};

export default ticketRepository;
