import Joi from 'joi';

export const createTickedSchema = Joi.object<{ ticketTypeId: number }>({
  ticketTypeId: Joi.number().required(),
});
