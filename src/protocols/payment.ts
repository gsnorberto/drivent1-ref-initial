import { Payment } from '@prisma/client';

export type PaymentData = Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>;

export type PaymentGeneralData = {
  ticketId: number;
  cardData: {
    issuer: string;
    number: string;
    name: string;
    expirationDate: Date;
    cvv: string;
  };
};
