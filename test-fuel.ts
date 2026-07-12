import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const logs = await prisma.fuelLog.findMany();
  console.log("Logs count:", logs.length);
}
main();
