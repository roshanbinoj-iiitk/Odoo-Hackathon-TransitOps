import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { requireAuth } from '../../../lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  return requireAuth(async (req, res, user) => {
    if (req.method === 'GET') {
      try {
        const drivers = await prisma.driver.findMany({
          orderBy: { createdAt: 'desc' }
        });
        return res.status(200).json(drivers);
      } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
      }
    } else if (req.method === 'POST') {
      try {
        const data = req.body;
        const newDriver = await prisma.driver.create({
          data: {
            name: data.name,
            licenseNumber: data.licenseNumber,
            licenseExpiry: new Date(data.licenseExpiry),
            safetyScore: Number(data.safetyScore || 100),
            experienceYears: Number(data.experienceYears || 0),
            status: data.status || 'AVAILABLE',
          }
        });
        return res.status(201).json(newDriver);
      } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
      }
    } else {
      res.status(405).json({ message: 'Method Not Allowed' });
    }
  })(req, res);
}
