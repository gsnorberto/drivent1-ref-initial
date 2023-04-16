import Joi from 'joi';
import { PaymentGeneralData } from '@/protocols/payment';

export const paymentInfoSchema = Joi.object<{ ticketId: number }>({
  ticketId: Joi.number().required(),
});

export const paymentDataSchema = Joi.object<PaymentGeneralData>({
  ticketId: Joi.number().required(),
  cardData: {
    issuer: Joi.string().required(),
    number: Joi.string().required(),
    name: Joi.string().required(),
    expirationDate: Joi.any().required(),
    cvv: Joi.string().required(),
  },
});
