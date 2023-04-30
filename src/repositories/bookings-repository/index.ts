import { prisma } from '@/config';

async function getUserBooking(userId: number) {
  return prisma.booking.findFirst({
    where: { userId },
    select: {
      id: true,
      Room: true,
    },
  });
}

async function getBookingById(bookingId: number) {
  return prisma.booking.findFirst({
    where: { id: bookingId },
  });
}

async function addBooking(userId: number, roomId: number) {
  return prisma.booking.create({
    data: { userId, roomId },
  });
}

// async function changeBooking() {

// }

const bookingRepository = {
  getUserBooking,
  getBookingById,
  addBooking,
  // changeBooking
};

export default bookingRepository;
