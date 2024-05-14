import { Prisma } from "@prisma/client";

const customersData = [
    {
      id: "customer1",
      phone: '1234567890',
      name: 'John Doe',
      loyaltyPoints: 100,
      firstBoughtAt: new Date(),
    },
    {
      id: "customer2",
      phone: '9876543210',
      name: 'Jane Smith',
      loyaltyPoints: 150,
      firstBoughtAt: new Date(),
    },
    // Add more customer data as needed
];

export default customersData;