import { Prisma } from '@prisma/client';

const categories: Prisma.CategoryCreateInput[] = [
  {
    id: 'cat1',
    name: 'Electronics',
    photo: 'https://example.com/photos/electronics.jpg',
  },
  {
    id: 'cat2',
    name: 'Headset',
    photo: 'https://example.com/photos/clothing.jpg',
  },
  {
    id: 'cat3',
    name: 'Home Appliances',
    photo: 'https://example.com/photos/home_appliances.jpg',
  },
];

export default categories;
