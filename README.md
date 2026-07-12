# TransitOps

TransitOps is a comprehensive Fleet and Logistics Management platform built for the Odoo Hackathon. It provides a centralized dashboard to manage vehicles, drivers, trips, maintenance, and expenses with built-in Role-Based Access Control (RBAC).

## Features

- **Dashboard**: High-level KPIs, fleet utilization, and active trip tracking.
- **Fleet Management**: Track vehicle status, health score, mileage, and maintenance logs.
- **Driver Management**: Manage driver profiles, licenses, safety scores, and availability.
- **Trip Lifecycle**: Dispatch, track, and complete trips with real-time status updates.
- **Maintenance & Fuel Logs**: Record maintenance costs, fuel expenses, and track operational efficiency.
- **Analytics & Reports**: Comprehensive reports for fuel efficiency, ROI, and top costliest vehicles.
- **Role-Based Access Control (RBAC)**: Fine-grained permissions for Fleet Managers, Dispatchers, Safety Officers, and Financial Analysts.

## Tech Stack

- **Frontend**: Next.js (Pages Router), React, Tailwind CSS, shadcn/ui, Recharts, Framer Motion
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT + bcrypt
- **Data Fetching**: SWR

## Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL database

### 1. Environment Setup

Install dependencies:
```bash
npm install
```

Ensure you have a running PostgreSQL instance. Update the `DATABASE_URL` in the `.env` file at the root of the project:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/transitops?schema=public"
JWT_SECRET="supersecret_jwt_key_transitops_hackathon_2026"
```

### 2. Database Initialization

Run the Prisma commands to generate the client and push the schema to your database:
```bash
npx prisma generate
npx prisma db push
```

Seed the database with default roles and mock data:
```bash
npx prisma db seed
```
*(This will populate the database with default users and mock data for vehicles, drivers, and trips).*

### 3. Start Development Server

Run the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to view the application.

## API & Backend Documentation

For detailed backend integration notes, API endpoints, and authentication workflows, refer to the [Backend README](./README-BACKEND.md).

## Project Structure

- `pages/`: Contains Next.js pages and API routes (`pages/api/`).
- `components/`: Reusable UI components.
- `prisma/`: Prisma schema and database seed script.
- `lib/`: Utility functions and database client configuration.

## License
MIT
