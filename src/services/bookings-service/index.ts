import { Booking, Room } from '@prisma/client';
import bookingRepository from '@/repositories/bookings-repository';
import { notFoundError } from '@/errors';

async function getUserBooking(userId: number): Promise<{ id: number; Room: Room }> {
  const booking = await bookingRepository.getUserBooking(userId);

  if (!booking) throw notFoundError();

  return booking;
}

// async function addBooking(userId: number){

// }

// async function changeBooking(userId: number){

// }

const bookingsService = {
  getUserBooking,
  // addBooking,
  // changeBooking
};

export default bookingsService;
