import { prisma } from '@/config';

async function getHotels() {
  return prisma.hotel.findMany();
}

async function getHotelRooms() {
  return prisma.hotel.findMany({
    select: {
      id: true,
      name: true,
      image: true,
      createdAt: true,
      updatedAt: true,
      Rooms: true,
    },
  });
}

const hotelRepository = {
  getHotels,
  getHotelRooms,
};
export default hotelRepository;
