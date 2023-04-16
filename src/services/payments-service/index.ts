import { Payment } from '@prisma/client';
import paymentRepository from '@/repositories/payment-repository';
import ticketRepository from '@/repositories/ticket-repository';
import { PaymentGeneralData, PaymentData } from '@/protocols/payment';

import { notFoundError, unauthorizedError } from '@/errors';

async function getPaymentInformation(ticketId: number, userId: number): Promise<Payment> {
  const paymentInfos = await ticketRepository.getTicketWithEnrollment(ticketId);
  const ownerTicketId = paymentInfos?.Enrollment?.userId;
  if (!ownerTicketId) throw notFoundError();
  if (ownerTicketId !== userId) throw unauthorizedError('User is not the owner of the ticket');

  const payment = await paymentRepository.getPaymentInformation(ticketId);
  if (!payment) throw notFoundError();

  return payment;
}

async function makePayment(data: PaymentGeneralData, userId: number) {
  const ticket = await ticketRepository.getTicketById(data.ticketId);
  if (!ticket) throw notFoundError();

  const paymentInfos = await ticketRepository.getTicketWithEnrollment(data.ticketId);
  const ownerTicketId = paymentInfos?.Enrollment?.userId;
  if (!ownerTicketId) throw notFoundError();
  if (ownerTicketId !== userId) throw unauthorizedError('User is not the owner of the ticket');

  const ticketWithTicketType = await ticketRepository.getTicketWithTicketType(data.ticketId);

  const cardNumber = data.cardData.number;
  const cardLastDigits = cardNumber.substring(cardNumber.length - 4, cardNumber.length);

  const paymentData: PaymentData = {
    ticketId: data.ticketId,
    value: ticketWithTicketType.TicketType.price,
    cardIssuer: data.cardData.issuer,
    cardLastDigits,
  };

  await ticketRepository.updateTicketStatus(data.ticketId);
  const payment = await paymentRepository.makePayment(paymentData);

  return payment;
}

const paymentsService = {
  getPaymentInformation,
  makePayment,
};

export default paymentsService;
