import { Hotel, Room } from '@prisma/client';

export type HotelDataType = Omit<Hotel, 'createdAt' | 'updatedAt'>;
