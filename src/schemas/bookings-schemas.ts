import Joi from 'joi';

export const addBookingSchema = Joi.object({
  roomId: Joi.number().required(),
});

export const changeBookingSchema = Joi.object({
  bookingId: Joi.number().required(),
});
