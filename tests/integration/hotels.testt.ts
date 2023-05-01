import httpStatus from 'http-status';
import supertest from 'supertest';
import { cleanDb, generateValidToken } from '../helpers';
import {
  createUser,
  createHotel,
  createTicketType,
  createTicket,
  createEnrollmentWithAddress,
  createRoom,
} from '../factories';
import app, { init } from '@/app';

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe('GET /hotels', () => {
  it('should respond with status 401 when token is invalid', async () => {
    const response = await server.get('/hotels').set('Authorization', 'Bearer xxxxx');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 404 when enrollment does not exist', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);

    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });

  it('should respond with status 404 when ticket does not exist', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);

    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });

  it('should respond with status 402 if the ticket has not been paid', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const hotel = await createHotel();
    const room = await createRoom(hotel.id);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketType(false, true);
    const ticket = await createTicket(enrollment.id, ticketType.id, 'RESERVED');

    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
  });

  it('should respond with status 402 if ticket type is remote', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const hotel = await createHotel();
    const room = await createRoom(hotel.id);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketType(true, false);
    const ticket = await createTicket(enrollment.id, ticketType.id, 'PAID');

    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
  });

  it('should respond with status 402 if ticket does not include hotel', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const hotel = await createHotel();
    const room = await createRoom(hotel.id);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketType(true, false);
    const ticket = await createTicket(enrollment.id, ticketType.id, 'PAID');

    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
  });

  it('should respond with status 404 when hotel does not exist', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);

    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });

  it('should return the list of available hotels', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const hotel = await createHotel();
    const room = await createRoom(hotel.id);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketType(false, true);
    const ticket = await createTicket(enrollment.id, ticketType.id, 'PAID');

    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.OK);

    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: hotel.id,
          name: hotel.name,
          image: hotel.image,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        }),
      ]),
    );
  });
});

describe('GET /hotels/:hotelId', () => {
  it('should respond with status 401 when token is invalid', async () => {
    const response = await server.get('/hotels').set('Authorization', 'Bearer xxxxx');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 400 when hotelId format is invalid', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const ticketType = await createTicketType();
    const enrollment = await createEnrollmentWithAddress(user);
    const ticket = await createTicket(enrollment.id, ticketType.id, 'PAID');

    const response = await server.get('/hotels/abc').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });

  it('should respond with status 404 when enrollment does not exist', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const hotel = await createHotel();
    const room = await createRoom(hotel.id);
    const ticketType = await createTicketType(false, true);

    const response = await server.get(`/hotels/${hotel.id}`).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });

  it('should respond with status 404 when ticket does not exist', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const hotel = await createHotel();
    const room = await createRoom(hotel.id);
    const ticketType = await createTicketType(false, true);

    const response = await server.get(`/hotels/${hotel.id}`).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });

  it('should respond with status 404 when hotel does not exist', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const ticketType = await createTicketType();
    const enrollment = await createEnrollmentWithAddress(user);
    const ticket = await createTicket(enrollment.id, ticketType.id, 'PAID');

    const response = await server.get('/hotels/0').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });

  it('should respond with status 402 if the ticket has not been paid', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const ticketType = await createTicketType();
    const enrollment = await createEnrollmentWithAddress(user);
    const ticket = await createTicket(enrollment.id, ticketType.id, 'RESERVED');
    const hotel = await createHotel();

    const response = await server.get(`/hotels/${hotel.id}`).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
  });

  it('should respond with status 402 if ticket type is remote', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const ticketType = await createTicketType(true, false);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticket = await createTicket(enrollment.id, ticketType.id, 'PAID');
    const hotel = await createHotel();

    const response = await server.get(`/hotels/${hotel.id}`).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
  });

  it('should respond with status 402 if ticket does not include hotel', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const ticketType = await createTicketType(true, false);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticket = await createTicket(enrollment.id, ticketType.id, 'PAID');
    const hotel = await createHotel();

    const response = await server.get(`/hotels/${hotel.id}`).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
  });

  it('should return the list of available hotels', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const hotel = await createHotel();
    const room = await createRoom(hotel.id);
    const ticketType = await createTicketType(false, true);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticket = await createTicket(enrollment.id, ticketType.id, 'PAID');

    const response = await server.get(`/hotels/${hotel.id}`).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.OK);

    expect(response.body).toEqual(
      expect.objectContaining({
        id: hotel.id,
        name: hotel.name,
        image: hotel.image,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        Rooms: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            name: expect.any(String),
            capacity: expect.any(Number),
            hotelId: hotel.id,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          }),
        ]),
      }),
    );
  });
});
