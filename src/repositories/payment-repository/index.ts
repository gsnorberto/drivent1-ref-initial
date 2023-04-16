import { prisma } from '@/config';
import { PaymentData } from '@/protocols/payment';

async function getPaymentInformation(ticketId: number) {
  return prisma.payment.findFirst({
    where: { ticketId },
  });
}

async function makePayment(data: PaymentData) {
  return prisma.payment.create({
    data,
  });
}

const paymentRepository = {
  getPaymentInformation,
  makePayment,
};

export default paymentRepository;
