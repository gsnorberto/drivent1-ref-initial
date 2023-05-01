import { Booking, Room } from '@prisma/client';
import { notFoundError, forbiddenError } from '@/errors';
import bookingRepository from '@/repositories/bookings-repository';
import roomRepository from '@/repositories/room-repository';
import ticketRepository from '@/repositories/ticket-repository';

async function getUserBooking(userId: number): Promise<{ id: number; Room: Room }> {
  const booking = await bookingRepository.getUserBooking(userId);
  if (!booking) throw notFoundError();

  return booking;
}

async function addBooking(userId: number, roomId: number): Promise<{ bookingId: number }> {
  const room = await roomRepository.getRoom(roomId);
  if (!room) throw notFoundError();

  const booking = await bookingRepository.getBookingByRoomId(room.id);
  if (booking) throw forbiddenError('Sold out rooms');

  const ticket = await ticketRepository.getTicketWithEnrollmentByUserId(userId);
  if (!ticket) throw forbiddenError('User does not have ticket');
  if (ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw forbiddenError('Ticket does not include hotel (is remote)');
  }
  if (ticket.status !== 'PAID') throw forbiddenError('Ticket not have been paid');

  const newBooking = await bookingRepository.addBooking(userId, roomId);

  return { bookingId: newBooking.id };
}

async function changeBooking(userId: number, roomId: number, bookingId: number) {
  const room = await roomRepository.getRoom(roomId);
  if (!room) throw notFoundError();

  const intendedBooking = await bookingRepository.getBookingByRoomId(roomId);
  if (intendedBooking) throw forbiddenError('Sold out rooms');

  const currentBooking = await bookingRepository.getBookingById(bookingId);
  if (!currentBooking || currentBooking.userId !== userId) {
    throw forbiddenError('User does not have booking');
  }

  const newBooking = await bookingRepository.changeBooking(currentBooking.id, roomId);

  return { bookingId: newBooking.id };
}

const bookingService = {
  getUserBooking,
  addBooking,
  changeBooking,
};

export default bookingService;
