import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { requireAuth } from '../../../lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  return requireAuth(async (req, res, user) => {
    try {
      const { region, type, status } = req.query;

      // Base query for vehicles
      const vehicleWhere: any = {};
      if (type) vehicleWhere.type = type as string;
      if (status) vehicleWhere.status = status as string;
      
      const [
        totalVehicles,
        activeVehicles,
        availableVehicles,
        maintenanceVehicles,
        activeTrips,
        pendingTrips,
        driversOnDuty,
        totalDistanceAgg,
        totalFuelAgg,
        totalFuelCostAgg,
        totalMaintenanceCostAgg
      ] = await Promise.all([
        prisma.vehicle.count({ where: vehicleWhere }),
        prisma.vehicle.count({ where: { ...vehicleWhere, status: 'ON_TRIP' } }),
        prisma.vehicle.count({ where: { ...vehicleWhere, status: 'AVAILABLE' } }),
        prisma.vehicle.count({ where: { ...vehicleWhere, status: 'IN_SHOP' } }),
        prisma.trip.count({ where: { status: 'DISPATCHED' } }),
        prisma.trip.count({ where: { status: { in: ['DRAFT', 'ASSIGNED'] } } }),
        prisma.driver.count({ where: { status: 'ON_TRIP' } }),
        prisma.trip.aggregate({ _sum: { distance: true }, where: { status: 'COMPLETED' } }),
        prisma.fuelLog.aggregate({ _sum: { gallons: true, cost: true } }),
        prisma.fuelLog.aggregate({ _sum: { cost: true } }),
        prisma.maintenanceLog.aggregate({ _sum: { cost: true } })
      ]);

      const totalDistance = totalDistanceAgg._sum.distance || 0;
      const totalFuel = totalFuelAgg._sum.gallons || 0;
      
      const metrics = {
        activeVehicles,
        availableVehicles,
        maintenanceVehicles,
        activeTrips,
        pendingTrips,
        driversOnDuty,
        fleetUtilization: totalVehicles > 0 ? (activeVehicles / totalVehicles) * 100 : 0,
        fuelEfficiency: totalFuel > 0 ? totalDistance / totalFuel : 0,
        operationalCost: (totalFuelCostAgg._sum.cost || 0) + (totalMaintenanceCostAgg._sum.cost || 0)
      };

      res.status(200).json(metrics);
    } catch (error) {
      console.error('Dashboard error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  })(req, res);
}
