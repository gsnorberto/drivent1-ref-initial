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

// async function addBooking() {

// }

// async function changeBooking() {

// }

const bookingRepository = {
  getUserBooking,
  // addBooking,
  // changeBooking
};

export default bookingRepository;
