import Joi from 'joi';

export const paymentInfoSchema = Joi.object<{ ticketId: number }>({
  ticketId: Joi.number().required(),
});
