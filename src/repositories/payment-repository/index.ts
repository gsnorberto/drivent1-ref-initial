import { prisma } from '@/config';

async function getPaymentInformation(ticketId: number) {
  return prisma.payment.findFirst({
    where: { ticketId },
  });
}

const paymentRepository = {
  getPaymentInformation,
};

export default paymentRepository;
