import httpStatus from 'http-status';
import faker from '@faker-js/faker';
import supertest from 'supertest';
import {
  createBooking,
  createEnrollmentWithAddress,
  createHotel,
  createRoom,
  createTicket,
  createTicketType,
  createUser,
} from '../factories';
import { cleanDb, generateValidToken } from '../helpers';
import app, { init } from '@/app';

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe('GET /booking', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get('/booking');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 404 if booking does not exists', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);

    const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });

  it('should respond with status 200 if booking exists', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const hotel = await createHotel();
    const room = await createRoom(hotel.id);
    const booking = await createBooking(user.id, room.id);

    const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.OK);
    expect(response.body).toEqual({
      id: booking.id,
      Room: {
        id: room.id,
        name: room.name,
        capacity: room.capacity,
        hotelId: room.hotelId,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      },
    });
  });
});

describe('POST /booking', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.post('/booking');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.post('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 400 if roomId is invalid', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const body = { roomId: 'abc' };

    const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send(body);

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });

  it('should respond with status 404 if room does not exists', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const body = { roomId: 0 };

    const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send(body);

    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });

  it('should respond with status 403 if room has already been booked', async () => {
    const user = await createUser();
    const hotel = await createHotel();
    const room = await createRoom(hotel.id);
    const booking = await createBooking(user.id, room.id);
    const body = { roomId: room.id };

    const user2 = await createUser();
    const token = await generateValidToken(user2);

    const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send(body);

    expect(response.status).toBe(httpStatus.FORBIDDEN);
  });

  it('should respond with status 403 if user does not have ticket', async () => {
    const user = await createUser();
    const hotel = await createHotel();
    const room = await createRoom(hotel.id);
    const token = await generateValidToken(user);
    const body = { roomId: room.id };

    const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send(body);

    expect(response.status).toBe(httpStatus.FORBIDDEN);
  });

  it('should respond with status 403 if ticket does not include hotel ', async () => {
    const user = await createUser();
    const hotel = await createHotel();
    const room = await createRoom(hotel.id);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketType(true, false);
    const ticket = await createTicket(enrollment.id, ticketType.id, 'PAID');
    const token = await generateValidToken(user);
    const body = { roomId: room.id };

    const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send(body);

    expect(response.status).toBe(httpStatus.FORBIDDEN);
  });

  it('should respond with status 403 if ticket not have been paid ', async () => {
    const user = await createUser();
    const hotel = await createHotel();
    const room = await createRoom(hotel.id);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketType(false, true);
    const ticket = await createTicket(enrollment.id, ticketType.id, 'RESERVED');
    const token = await generateValidToken(user);
    const body = { roomId: room.id };

    const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send(body);

    expect(response.status).toBe(httpStatus.FORBIDDEN);
  });

  it('should respond with status 200 if user to book a room', async () => {
    const user = await createUser();
    const hotel = await createHotel();
    const room = await createRoom(hotel.id);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketType(false, true);
    const ticket = await createTicket(enrollment.id, ticketType.id, 'PAID');
    const token = await generateValidToken(user);
    const body = { roomId: room.id };

    const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send(body);

    expect(response.status).toBe(httpStatus.OK);
    expect(response.body).toEqual({ bookingId: expect.any(Number) });
  });
});

describe('PUT /booking/:bookingId', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.put('/booking/123');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.put('/booking/123').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 400 if bookingId is invalid', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const body = { roomId: 1 };

    const response = await server.put('/booking/abc').set('Authorization', `Bearer ${token}`).send(body);

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });

  it('should respond with status 400 if roomId is invalid', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const body = { roomId: 'abc' };

    const response = await server.put('/booking/123').set('Authorization', `Bearer ${token}`).send(body);

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });

  it('should respond with status 404 if room does not exists', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const body = { roomId: 0 };

    const response = await server.put('/booking/123').set('Authorization', `Bearer ${token}`).send(body);

    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });

  it('should respond with status 403 if room has already been booked', async () => {
    const user = await createUser();
    const hotel = await createHotel();
    const room = await createRoom(hotel.id);
    const booking = await createBooking(user.id, room.id);
    const body = { roomId: room.id };

    const user2 = await createUser();
    const token = await generateValidToken(user2);

    const response = await server.put('/booking/123').set('Authorization', `Bearer ${token}`).send(body);

    expect(response.status).toBe(httpStatus.FORBIDDEN);
  });

  it('should respond with status 403 if user does not have booking', async () => {
    const user = await createUser();
    const hotel = await createHotel();
    const room = await createRoom(hotel.id);
    const body = { roomId: room.id };
    const token = await generateValidToken(user);

    const response = await server.put('/booking/123').set('Authorization', `Bearer ${token}`).send(body);

    expect(response.status).toBe(httpStatus.FORBIDDEN);
  });

  it('should respond with status 403 if booking does not belong to the user', async () => {
    const user = await createUser();
    const hotel = await createHotel();
    const room = await createRoom(hotel.id);
    const booking = await createBooking(user.id, room.id);

    const user2 = await createUser();
    const hotel2 = await createHotel();
    const room2 = await createRoom(hotel2.id);
    const booking2 = await createBooking(user2.id, room2.id);

    const body = { roomId: room2.id };
    const token = await generateValidToken(user2);

    const response = await server.put(`/booking/${booking.id}`).set('Authorization', `Bearer ${token}`).send(body);

    expect(response.status).toBe(httpStatus.FORBIDDEN);
  });

  it('should respond with status 200 if ok', async () => {
    const user = await createUser();
    const hotel = await createHotel();
    const room = await createRoom(hotel.id);
    const booking = await createBooking(user.id, room.id);

    const hotel2 = await createHotel();
    const room2 = await createRoom(hotel2.id);

    const body = { roomId: room2.id };
    const token = await generateValidToken(user);

    const response = await server.put(`/booking/${booking.id}`).set('Authorization', `Bearer ${token}`).send(body);

    expect(response.status).toBe(httpStatus.OK);
    expect(response.body).toEqual({ bookingId: expect.any(Number) });
  });
});
