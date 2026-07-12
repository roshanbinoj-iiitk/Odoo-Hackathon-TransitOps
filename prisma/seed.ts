import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { mockVehicles, mockDrivers, mockTrips, mockMaintenanceLogs, mockFuelLogs } from '../data/mock';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

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
  const mappedVehicles = mockVehicles.map((v) => {
    let status = 'AVAILABLE';
    if (v.status === 'On Trip') status = 'ON_TRIP';
    else if (v.status === 'Maintenance') status = 'IN_SHOP';
    else if (v.status === 'Retired') status = 'RETIRED';

    return {
      id: v.id,
      registration: v.registration,
      make: v.make,
      model: v.model,
      year: v.year,
      type: v.type,
      status: status as any,
      mileage: v.mileage,
      lastService: v.lastService ? new Date(v.lastService) : null,
      healthScore: v.healthScore,
    };
  });

  for (const v of mappedVehicles) {
    await prisma.vehicle.upsert({
      where: { id: v.id },
      update: {},
      create: v,
    });
  }
  console.log('Vehicles seeded');

  // 3. Seed Drivers
  const mappedDrivers = mockDrivers.map((d) => {
    let status = 'AVAILABLE';
    if (d.status === 'On Trip') status = 'ON_TRIP';
    else if (d.status === 'Off Duty') status = 'OFF_DUTY';
    else if (d.status === 'Suspended') status = 'SUSPENDED';

    return {
      id: d.id,
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

  for (const d of mappedDrivers) {
    await prisma.driver.upsert({
      where: { id: d.id },
      update: {},
      create: d,
    });
  }
  console.log('Drivers seeded');

  // 4. Seed Trips
  const mappedTrips = mockTrips.map((t) => {
    let status = 'DRAFT';
    if (t.status === 'Assigned') status = 'ASSIGNED';
    else if (t.status === 'Dispatched') status = 'DISPATCHED';
    else if (t.status === 'Completed') status = 'COMPLETED';
    else if (t.status === 'Cancelled') status = 'CANCELLED';

    return {
      id: t.id,
      source: t.source,
      destination: t.destination,
      vehicleId: t.vehicleId,
      driverId: t.driverId,
      cargo: t.cargo,
      distance: t.distance,
      weight: t.weight,
      status: status as any,
      scheduledDeparture: new Date(t.scheduledDeparture),
      estimatedArrival: new Date(t.estimatedArrival),
      actualDeparture: t.actualDeparture ? new Date(t.actualDeparture) : null,
      actualArrival: t.actualArrival ? new Date(t.actualArrival) : null,
    };
  });

  for (const t of mappedTrips) {
    await prisma.trip.upsert({
      where: { id: t.id },
      update: {},
      create: t,
    });
  }
  console.log('Trips seeded');

  // 5. Seed Maintenance
  const mappedMaintenance = mockMaintenanceLogs.map((m) => {
    let status = 'SCHEDULED';
    if (m.status === 'Completed') status = 'COMPLETED';
    else if (m.status === 'In Progress') status = 'IN_PROGRESS';

    return {
      id: m.id,
      vehicleId: m.vehicleId,
      service: m.service,
      date: new Date(m.date),
      technician: m.technician,
      cost: m.cost,
      status: status as any,
    };
  });

  for (const m of mappedMaintenance) {
    await prisma.maintenanceLog.upsert({
      where: { id: m.id },
      update: {},
      create: m,
    });
  }
  console.log('Maintenance seeded');

  // 6. Seed Fuel Logs
  const mappedFuel = mockFuelLogs.map((f) => ({
    id: f.id,
    vehicleId: f.vehicleId,
    date: new Date(f.date),
    gallons: f.gallons,
    cost: f.cost,
    location: f.location,
  }));

  for (const f of mappedFuel) {
    await prisma.fuelLog.upsert({
      where: { id: f.id },
      update: {},
      create: f,
    });
  }
  console.log('Fuel logs seeded');

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
