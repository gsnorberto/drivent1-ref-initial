import { Payment } from '@prisma/client';
import paymentRepository from '@/repositories/payment-repository';
import ticketRepository from '@/repositories/ticket-repository';

import { notFoundError, unauthorizedError } from '@/errors';

async function getPaymentInformation(ticketId: number, userId: number): Promise<Payment> {
  const paymentInfos = await ticketRepository.getTicketWithEnrollment(ticketId);
  const ownerTicketId = paymentInfos?.Enrollment?.userId;
  if (!ownerTicketId) throw notFoundError();
  if (ownerTicketId !== userId) throw unauthorizedError();

  const payment = await paymentRepository.getPaymentInformation(ticketId);
  if (!payment) throw notFoundError();

  return payment;
}

const paymentsService = {
  getPaymentInformation,
};

export default paymentsService;
