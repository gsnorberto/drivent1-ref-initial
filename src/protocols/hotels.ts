import { Hotel } from '@prisma/client';

export type HotelDataType = Omit<Hotel, 'createdAt' | 'updatedAt'>;
