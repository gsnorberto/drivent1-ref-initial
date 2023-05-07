import hotelRepository from '@/repositories/hotel-repository';
import ticketRepository from '@/repositories/ticket-repository';
import hotelsService from '@/services/hotels-service';

describe('Hotels service tests', () => {
  describe('getHotels', () => {
    it('should not get hotels when ticket does not exist', async () => {
      jest.spyOn(ticketRepository, 'getTicketWithEnrollmentByUserId').mockImplementationOnce((): any => {
        return undefined;
      });

      const promise = hotelsService.getHotels(123);

      expect(promise).rejects.toEqual({
        name: 'NotFoundError',
        message: 'No result for this search!',
      });
    });

    it('should not get hotels when ticket status is RESERVED', async () => {
      jest.spyOn(ticketRepository, 'getTicketWithEnrollmentByUserId').mockImplementationOnce((): any => {
        return { status: 'RESERVED' };
      });

      const promise = hotelsService.getHotels(123);

      expect(promise).rejects.toEqual({
        name: 'PaymentRequiredError',
        message: 'The payment is pending',
      });
    });

    it('should not get hotels when ticket type is remote', async () => {
      jest.spyOn(ticketRepository, 'getTicketWithEnrollmentByUserId').mockImplementationOnce((): any => {
        return {
          status: 'PAID',
          TicketType: {
            isRemote: true,
            includesHotel: false,
          },
        };
      });

      const promise = hotelsService.getHotels(123);

      expect(promise).rejects.toEqual({
        name: 'PaymentRequiredError',
        message: 'The payment is pending',
      });
    });

    it('should not get hotels when there are no hotels', async () => {
      jest.spyOn(ticketRepository, 'getTicketWithEnrollmentByUserId').mockImplementationOnce((): any => {
        return {
          status: 'PAID',
          TicketType: {
            isRemote: false,
            includesHotel: true,
          },
        };
      });

      jest.spyOn(hotelRepository, 'getHotels').mockImplementationOnce((): any => {
        return [];
      });

      const promise = hotelsService.getHotels(123);

      expect(promise).rejects.toEqual({
        name: 'NotFoundError',
        message: 'No result for this search!',
      });
    });
  });

  describe('getHotelRooms', () => {
    it('should not get hotel rooms when ticket does not exist', async () => {
      jest.spyOn(ticketRepository, 'getTicketWithEnrollmentByUserId').mockImplementationOnce((): any => {
        return undefined;
      });

      const promise = hotelsService.getHotelRooms(1, 1);

      expect(promise).rejects.toEqual({
        name: 'NotFoundError',
        message: 'No result for this search!',
      });
    });

    it('should not get hotel rooms when hotel rooms does not exists', async () => {
      jest.spyOn(ticketRepository, 'getTicketWithEnrollmentByUserId').mockImplementationOnce((): any => {
        return {};
      });

      jest.spyOn(hotelRepository, 'getHotelRooms').mockImplementationOnce((): any => {
        return undefined;
      });

      const promise = hotelsService.getHotelRooms(1, 1);

      expect(promise).rejects.toEqual({
        name: 'NotFoundError',
        message: 'No result for this search!',
      });
    });

    it('should not get hotel rooms when ticket status is RESERVED', async () => {
      jest.spyOn(ticketRepository, 'getTicketWithEnrollmentByUserId').mockImplementationOnce((): any => {
        return { status: 'RESERVED' };
      });

      jest.spyOn(hotelRepository, 'getHotelRooms').mockImplementationOnce((): any => {
        return {};
      });

      const promise = hotelsService.getHotelRooms(1, 1);

      expect(promise).rejects.toEqual({
        name: 'PaymentRequiredError',
        message: 'The payment is pending',
      });
    });

    it('should not get hotel rooms when ticket type is remote', async () => {
      jest.spyOn(ticketRepository, 'getTicketWithEnrollmentByUserId').mockImplementationOnce((): any => {
        return {
          status: 'PAID',
          TicketType: {
            isRemote: true,
            includesHotel: false,
          },
        };
      });

      jest.spyOn(hotelRepository, 'getHotelRooms').mockImplementationOnce((): any => {
        return {};
      });

      const promise = hotelsService.getHotelRooms(1, 1);

      expect(promise).rejects.toEqual({
        name: 'PaymentRequiredError',
        message: 'The payment is pending',
      });
    });

    it('should get hotel rooms', async () => {
      jest.spyOn(ticketRepository, 'getTicketWithEnrollmentByUserId').mockImplementationOnce((): any => {
        return {
          status: 'PAID',
          TicketType: {
            isRemote: false,
            includesHotel: true,
          },
        };
      });

      jest.spyOn(hotelRepository, 'getHotelRooms').mockImplementationOnce((): any => {
        return {
          id: 1,
          name: test,
        };
      });

      const response = await hotelsService.getHotelRooms(1, 1);

      expect(response).toEqual({
        id: 1,
        name: test,
      });
    });
  });
});
