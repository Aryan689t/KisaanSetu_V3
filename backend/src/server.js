import app from './app.js';
import dotenv from 'dotenv';
import { prisma, hasDatabaseUrl } from './config/db.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`🌾 KisanSetu Backend API Server Started`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`🗄️ Database: ${hasDatabaseUrl ? 'Prisma (Direct PostgreSQL)' : 'Supabase Client (PostgreSQL Bridge)'}`);
  console.log(`=========================================`);
});

const gracefulShutdown = async () => {
  console.log('\n[Server] Shutting down gracefully...');
  if (prisma) {
    await prisma.$disconnect();
  }
  server.close(() => {
    console.log('[Server] Closed successfully.');
    process.exit(0);
  });
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

export default server;
