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

async function getBookingByRoomId(roomId: number) {
  return prisma.booking.findFirst({
    where: { roomId },
  });
}

async function addBooking(userId: number, roomId: number) {
  return prisma.booking.create({
    data: { userId, roomId },
  });
}

async function changeBooking(bookingId: number, roomId: number) {
  return prisma.booking.update({
    where: { id: bookingId },
    data: { roomId },
  });
}

const bookingRepository = {
  getUserBooking,
  getBookingByRoomId,
  addBooking,
  changeBooking,
};

export default bookingRepository;
