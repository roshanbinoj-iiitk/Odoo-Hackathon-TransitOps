import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { requireAuth } from '../../../lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  return requireAuth(async (req, res, user) => {
    if (req.method === 'GET') {
      try {
        const vehicles = await prisma.vehicle.findMany({
          orderBy: { createdAt: 'desc' }
        });
        return res.status(200).json(vehicles);
      } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
      }
    } else if (req.method === 'POST') {
      try {
        const data = req.body;
        // Validate registration
        const existing = await prisma.vehicle.findUnique({ where: { registration: data.registration } });
        if (existing) {
          return res.status(400).json({ message: 'Vehicle registration must be unique.' });
        }
        
        const newVehicle = await prisma.vehicle.create({
          data: {
            registration: data.registration,
            make: data.make,
            model: data.model,
            year: Number(data.year),
            type: data.type,
            status: data.status || 'AVAILABLE',
            mileage: Number(data.mileage || 0),
            healthScore: Number(data.healthScore || 100),
          }
        });
        return res.status(201).json(newVehicle);
      } catch (error) {
        console.error('Vehicle creation error:', error);
        return res.status(500).json({ message: 'Internal server error' });
      }
    } else {
      res.status(405).json({ message: 'Method Not Allowed' });
    }
  })(req, res);
}
