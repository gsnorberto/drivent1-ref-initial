import Joi from 'joi';

export const createHotelSchema = Joi.object({
  hotelId: Joi.number().required(),
});
