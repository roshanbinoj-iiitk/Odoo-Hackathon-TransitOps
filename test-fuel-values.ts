import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const logs = await prisma.fuelLog.findMany({ take: 5 });
  console.log(logs.map(l => ({ cost: l.cost, liters: l.liters })));
}
main();
