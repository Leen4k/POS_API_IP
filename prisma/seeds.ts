import { PrismaClient } from "@prisma/client";
import seedCategories from "./seeds/seedCategories";
import seedCustomers from "./seeds/seedCustomers";
import seedEmployees from "./seeds/seedEmployees";
import seedProducts from "./seeds/seedProducts";
import { seedOrders } from "./seeds/seedOrders";
import { seedOrderItems } from "./seeds/seedOrderItems";
import { seedPurchaseHistories } from "./seeds/seedPurchaseHistories";
import { seedPromotions } from "./seeds/seedPromotions";

const prisma = new PrismaClient();


const main = async () => {
  await seedCategories();
  await seedCustomers();
  await seedEmployees();
  await seedProducts();
  await seedOrders();
  await seedOrderItems();
  await seedPurchaseHistories();
  await seedPromotions();
};

main()
  .catch(e => {
    console.error(e)
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
});


