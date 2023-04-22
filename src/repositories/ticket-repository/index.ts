import { prisma } from '@/config';

async function getTicketTypes() {
  return prisma.ticketType.findMany();
}

async function getTicketById(ticketId: number) {
  return prisma.ticket.findFirst({
    where: { id: ticketId },
  });
}

async function getTicketWithTicketType(ticketId: number) {
  return prisma.ticket.findFirst({
    where: { id: ticketId },
    include: {
      TicketType: true,
    },
  });
}

async function getTicketWithEnrollment(ticketId: number) {
  return prisma.ticket.findFirst({
    where: { id: ticketId },
    include: {
      Enrollment: true,
    },
  });
}

async function getTicketWithEnrollmentByUserId(userId: number) {
  return prisma.ticket.findFirst({
    where: {
      Enrollment: {
        userId,
      },
    },
    select: {
      status: true,
      Enrollment: {
        select: {
          userId: true,
        },
      },
      TicketType: {
        select: {
          includesHotel: true,
          isRemote: true,
        },
      },
    },
  });
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

async function updateTicketStatus(ticketId: number) {
  return prisma.ticket.update({
    where: { id: ticketId },
    data: { status: 'PAID' },
  });
}

const ticketRepository = {
  getTicketTypes,
  getTicketById,
  getTicketWithTicketType,
  getTicketWithEnrollment,
  getUserTickets,
  createTicket,
  updateTicketStatus,
  getTicketWithEnrollmentByUserId,
};

export default ticketRepository;
