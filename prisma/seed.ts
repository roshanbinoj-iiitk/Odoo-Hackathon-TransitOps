import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { mockDrivers } from '../data/mock';

const prisma = new PrismaClient();

const indianStates = ['Kerala', 'Tamil Nadu', 'Karnataka', 'Maharashtra', 'Delhi', 'Gujarat', 'Telangana', 'Andhra Pradesh', 'Rajasthan', 'Uttar Pradesh', 'West Bengal'];
const stateCodes = ['KL', 'TN', 'KA', 'MH', 'DL', 'GJ', 'TS', 'AP', 'RJ', 'UP', 'WB'];

const vehicleModels = [
  { make: 'Tata', model: 'Ace Gold', type: 'Light Commercial', capacity: 750, minCost: 500000, maxCost: 650000 },
  { make: 'Tata', model: 'Intra V30', type: 'Light Commercial', capacity: 1300, minCost: 750000, maxCost: 850000 },
  { make: 'Tata', model: '407 Gold', type: 'Medium Commercial', capacity: 2500, minCost: 1200000, maxCost: 1400000 },
  { make: 'Ashok Leyland', model: 'Dost+', type: 'Light Commercial', capacity: 1500, minCost: 780000, maxCost: 880000 },
  { make: 'Ashok Leyland', model: 'Bada Dost', type: 'Light Commercial', capacity: 1800, minCost: 950000, maxCost: 1050000 },
  { make: 'Mahindra', model: 'Bolero Pickup', type: 'Light Commercial', capacity: 1700, minCost: 850000, maxCost: 980000 },
  { make: 'Mahindra', model: 'Supro Maxitruck', type: 'Light Commercial', capacity: 1050, minCost: 650000, maxCost: 750000 },
  { make: 'Eicher', model: 'Pro 2049', type: 'Medium Commercial', capacity: 5000, minCost: 1450000, maxCost: 1650000 },
  { make: 'BharatBenz', model: '1217R', type: 'Heavy Commercial', capacity: 12000, minCost: 2200000, maxCost: 2600000 },
  { make: 'Force Motors', model: 'Traveller', type: 'Passenger Commercial', capacity: 2000, minCost: 1600000, maxCost: 1900000 },
  { make: 'Maruti Suzuki', model: 'Super Carry', type: 'Light Commercial', capacity: 740, minCost: 500000, maxCost: 600000 },
  { make: 'Toyota', model: 'Hilux', type: 'Pickup', capacity: 1000, minCost: 3000000, maxCost: 3800000 }
];

function generateRegistration(stateCode: string) {
  const rto = Math.floor(Math.random() * 90 + 1).toString().padStart(2, '0');
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const letters = chars.charAt(Math.floor(Math.random() * chars.length)) + chars.charAt(Math.floor(Math.random() * chars.length));
  const num = Math.floor(Math.random() * 9000 + 1000);
  return `${stateCode}${rto}${letters}${num}`;
}

async function main() {
  console.log('Seeding database...');
  await prisma.trip.deleteMany({});
  await prisma.maintenanceLog.deleteMany({});
  await prisma.fuelLog.deleteMany({});
  await prisma.vehicle.deleteMany({});
  await prisma.driver.deleteMany({});
  await prisma.user.deleteMany({});

  // 1. Create Default Users (RBAC)
  const password = await bcrypt.hash('password123', 10);
  
  const users = [
    { email: 'admin@transitops.in', name: 'Admin Manager', role: 'FLEET_MANAGER', password },
    { email: 'driver@transitops.in', name: 'John Driver', role: 'DRIVER', password },
    { email: 'safety@transitops.in', name: 'Safety Officer', role: 'SAFETY_OFFICER', password },
    { email: 'finance@transitops.in', name: 'Financial Analyst', role: 'FINANCIAL_ANALYST', password },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user,
    });
  }
  console.log('Users seeded');

  // 2. Seed Vehicles
  const vehiclesData = [];
  for (let i = 0; i < 40; i++) {
    const vModel = vehicleModels[Math.floor(Math.random() * vehicleModels.length)];
    const stateIdx = Math.floor(Math.random() * indianStates.length);
    const cost = Math.floor(Math.random() * (vModel.maxCost - vModel.minCost) + vModel.minCost);
    const mileage = Math.floor(Math.random() * 250000 + 5000);
    
    // Weighted status
    let status = 'AVAILABLE';
    const rand = Math.random();
    if (rand > 0.6 && rand < 0.85) status = 'ON_TRIP';
    else if (rand >= 0.85 && rand < 0.95) status = 'IN_SHOP';
    else if (rand >= 0.95) status = 'RETIRED';

    vehiclesData.push({
      registration: generateRegistration(stateCodes[stateIdx]),
      make: vModel.make,
      model: vModel.model,
      year: 2024 - Math.floor(Math.random() * 8),
      type: vModel.type,
      status: status as any,
      mileage: mileage,
      capacity: vModel.capacity,
      acquisitionCost: cost,
      region: indianStates[stateIdx],
      healthScore: Math.floor(Math.random() * 40 + 60),
    });
  }

  // Deduplicate registrations just in case
  const uniqueRegs = new Set();
  const filteredVehicles = vehiclesData.filter(v => {
    if (uniqueRegs.has(v.registration)) return false;
    uniqueRegs.add(v.registration);
    return true;
  });

  const createdVehicles = [];
  for (const v of filteredVehicles) {
    const created = await prisma.vehicle.create({ data: v });
    createdVehicles.push(created);
  }
  console.log(`Vehicles seeded: ${createdVehicles.length}`);

  // 3. Seed Drivers
  const mappedDrivers = mockDrivers.map((d) => {
    let status = 'AVAILABLE';
    if (d.status === 'On Trip') status = 'ON_TRIP';
    else if (d.status === 'Off Duty') status = 'OFF_DUTY';
    else if (d.status === 'Suspended') status = 'SUSPENDED';

    return {
      name: d.name,
      licenseNumber: d.licenseNumber,
      licenseExpiry: new Date(d.licenseExpiry),
      safetyScore: d.safetyScore,
      experienceYears: d.experienceYears,
      tripsCompleted: d.tripsCompleted,
      status: status as any,
      avatar: d.avatar || null,
    };
  });

  const createdDrivers = [];
  for (const d of mappedDrivers) {
    const drv = await prisma.driver.create({ data: d });
    createdDrivers.push(drv);
  }
  console.log('Drivers seeded');

  // 4. Generate random trips
  for (let i = 0; i < 15; i++) {
    const vehicle = createdVehicles[Math.floor(Math.random() * createdVehicles.length)];
    const driver = createdDrivers[Math.floor(Math.random() * createdDrivers.length)];
    
    await prisma.trip.create({
      data: {
        source: 'Mumbai',
        destination: 'Pune',
        vehicleId: vehicle.id,
        driverId: driver.id,
        cargo: 'Electronics',
        distance: 150,
        weight: vehicle.capacity,
        status: 'COMPLETED',
        scheduledDeparture: new Date(),
        estimatedArrival: new Date(Date.now() + 1000 * 60 * 60 * 4),
      }
    });
  }
  console.log('Trips seeded');

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
