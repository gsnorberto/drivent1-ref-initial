import bookingService from '@/services/booking-service';
import bookingRepository from '@/repositories/bookings-repository';
import ticketRepository from '@/repositories/ticket-repository';
import roomRepository from '@/repositories/room-repository';

describe('Booking Service Tests', () => {
  describe('get user bookings', () => {
    it('should get user bookings', async () => {
      jest.spyOn(bookingRepository, 'getUserBooking').mockImplementationOnce((): any => {
        return {};
      });

      await bookingService.getUserBooking(1);

      expect(bookingRepository.getUserBooking).toBeCalled();
    });

    it('should not get any user bookings', async () => {
      jest.spyOn(bookingRepository, 'getUserBooking').mockImplementationOnce((): any => {
        return undefined;
      });

      const promise = bookingService.getUserBooking(1);

      expect(promise).rejects.toEqual({
        name: 'NotFoundError',
        message: 'No result for this search!',
      });

      expect(bookingRepository.getUserBooking).toBeCalled();
    });
  });

  describe('add booking', () => {
    it('should not add a booking when room does not exist', async () => {
      jest.spyOn(roomRepository, 'getRoom').mockImplementationOnce((): any => {
        return undefined;
      });

      const promise = bookingService.addBooking(1, 1);

      expect(promise).rejects.toEqual({
        name: 'NotFoundError',
        message: 'No result for this search!',
      });
    });

    it('should not add a booking when room has already been booked', async () => {
      jest.spyOn(roomRepository, 'getRoom').mockImplementationOnce((): any => {
        return {};
      });

      jest.spyOn(bookingRepository, 'getBookingByRoomId').mockImplementationOnce((): any => {
        return {};
      });

      const promise = bookingService.addBooking(1, 1);

      expect(promise).rejects.toEqual({
        name: 'ForbiddenError',
        message: 'Sold out rooms',
      });
    });

    it('should not add a booking when ticket does not exists', async () => {
      jest.spyOn(roomRepository, 'getRoom').mockImplementationOnce((): any => {
        return {};
      });

      jest.spyOn(bookingRepository, 'getBookingByRoomId').mockImplementationOnce((): any => {
        return undefined;
      });

      jest.spyOn(ticketRepository, 'getTicketWithEnrollmentByUserId').mockImplementationOnce((): any => {
        return undefined;
      });

      const promise = bookingService.addBooking(1, 1);

      expect(promise).rejects.toEqual({
        name: 'ForbiddenError',
        message: 'User does not have ticket',
      });
    });

    it('should not add a booking when ticket does not include hotel (is remote)', async () => {
      jest.spyOn(roomRepository, 'getRoom').mockImplementationOnce((): any => {
        return {};
      });

      jest.spyOn(bookingRepository, 'getBookingByRoomId').mockImplementationOnce((): any => {
        return undefined;
      });

      jest.spyOn(ticketRepository, 'getTicketWithEnrollmentByUserId').mockImplementationOnce((): any => {
        return {
          TicketType: {
            isRemote: true,
          },
        };
      });

      const promise = bookingService.addBooking(1, 1);

      expect(promise).rejects.toEqual({
        name: 'ForbiddenError',
        message: 'Ticket does not include hotel (is remote)',
      });
    });

    it('should not add a booking when ticket not have been paid', async () => {
      jest.spyOn(roomRepository, 'getRoom').mockImplementationOnce((): any => {
        return {};
      });

      jest.spyOn(bookingRepository, 'getBookingByRoomId').mockImplementationOnce((): any => {
        return undefined;
      });

      jest.spyOn(ticketRepository, 'getTicketWithEnrollmentByUserId').mockImplementationOnce((): any => {
        return {
          status: 'RESERVED',
          TicketType: {
            isRemote: false,
            includesHotel: true,
          },
        };
      });

      const promise = bookingService.addBooking(1, 1);

      expect(promise).rejects.toEqual({
        name: 'ForbiddenError',
        message: 'Ticket not have been paid',
      });
    });

    it('should add a a booking', async () => {
      jest.spyOn(roomRepository, 'getRoom').mockImplementationOnce((): any => {
        return {};
      });

      jest.spyOn(bookingRepository, 'getBookingByRoomId').mockImplementationOnce((): any => {
        return undefined;
      });

      jest.spyOn(ticketRepository, 'getTicketWithEnrollmentByUserId').mockImplementationOnce((): any => {
        return {
          status: 'PAID',
          TicketType: {
            isRemote: false,
            includesHotel: true,
          },
        };
      });

      jest.spyOn(bookingRepository, 'addBooking').mockImplementationOnce((): any => {
        return { id: 120 };
      });

      const response = await bookingService.addBooking(1, 1);

      expect(response).toEqual({ bookingId: 120 });
    });
  });

  describe('change booking', () => {
    it('should not change a booking when room does not exist', async () => {
      jest.spyOn(roomRepository, 'getRoom').mockImplementationOnce((): any => {
        return undefined;
      });

      const promise = bookingService.changeBooking(1, 1, 1);

      expect(promise).rejects.toEqual({
        name: 'NotFoundError',
        message: 'No result for this search!',
      });
    });

    it('should not change a booking when room has already been booked', async () => {
      jest.spyOn(roomRepository, 'getRoom').mockImplementationOnce((): any => {
        return {};
      });

      jest.spyOn(bookingRepository, 'getBookingByRoomId').mockImplementationOnce((): any => {
        return {};
      });

      const promise = bookingService.changeBooking(1, 1, 1);

      expect(promise).rejects.toEqual({
        name: 'ForbiddenError',
        message: 'Sold out rooms',
      });
    });

    it('should not change a booking when user does not have booking', async () => {
      jest.spyOn(roomRepository, 'getRoom').mockImplementationOnce((): any => {
        return {};
      });

      jest.spyOn(bookingRepository, 'getBookingByRoomId').mockImplementationOnce((): any => {
        return undefined;
      });

      jest.spyOn(bookingRepository, 'getBookingById').mockImplementationOnce((): any => {
        return undefined;
      });

      const promise = bookingService.changeBooking(1, 1, 1);

      expect(promise).rejects.toEqual({
        name: 'ForbiddenError',
        message: 'User does not have booking',
      });
    });

    it('should change a book', async () => {
      jest.spyOn(roomRepository, 'getRoom').mockImplementationOnce((): any => {
        return {};
      });

      jest.spyOn(bookingRepository, 'getBookingByRoomId').mockImplementationOnce((): any => {
        return undefined;
      });

      jest.spyOn(bookingRepository, 'getBookingById').mockImplementationOnce((): any => {
        return { userId: 123 };
      });

      jest.spyOn(bookingRepository, 'changeBooking').mockImplementationOnce((): any => {
        return {
          id: 120,
        };
      });

      const response = await bookingService.changeBooking(123, 1, 1);

      expect(response).toEqual({ bookingId: 120 });
    });
  });
});
