import Joi from 'joi';

export const addBookingSchema = Joi.object({
  roomId: Joi.number().required(),
});
