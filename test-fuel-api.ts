import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  try {
    const logs = await prisma.fuelLog.findMany({
          include: { vehicle: true },
          orderBy: { createdAt: 'desc' }
    });
    console.log("Success, count:", logs.length);
  } catch (err: any) {
    console.log("Error:", err.message);
  }
}
main();
