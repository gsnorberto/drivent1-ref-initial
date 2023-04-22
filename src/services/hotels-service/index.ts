import { Hotel } from '@prisma/client';
import hotelRepository from '@/repositories/hotel-repository';
import ticketRepository from '@/repositories/ticket-repository';
import { notFoundError, paymentRequiredError } from '@/errors';

async function getHotels(userId: number): Promise<Hotel[]> {
  const ticket = await ticketRepository.getTicketWithEnrollmentByUserId(userId);
  if (!ticket) throw notFoundError();

  if (ticket.status !== 'PAID') throw paymentRequiredError();
  if (ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) throw paymentRequiredError();

  const hotels = await hotelRepository.getHotels();
  if (hotels.length === 0) throw notFoundError();

  return hotels;
}

async function getHotelRooms(userId: number) {
  const ticket = await ticketRepository.getTicketWithEnrollmentByUserId(userId);
  if (!ticket) throw notFoundError();

  if (ticket.status !== 'PAID') throw paymentRequiredError();
  if (ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) throw paymentRequiredError();

  const hotelRooms = await hotelRepository.getHotelRooms();
  if (hotelRooms.length === 0) throw notFoundError();

  return hotelRooms;
}

const hotelsService = {
  getHotels,
  getHotelRooms,
};
export default hotelsService;
