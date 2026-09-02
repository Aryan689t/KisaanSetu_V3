import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

let prisma = null;
const hasDatabaseUrl = Boolean(process.env.DATABASE_URL && process.env.DATABASE_URL.trim().length > 0);

if (hasDatabaseUrl) {
  try {
    prisma = new PrismaClient();
  } catch (err) {
    console.warn('[DB Config] Prisma initialization deferred:', err.message);
  }
}

// Fallback / Direct Supabase client using HTTPS API
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

let supabase = null;
if (supabaseUrl && supabaseKey && !supabaseUrl.includes('placeholder')) {
  supabase = createClient(supabaseUrl, supabaseKey);
}

export { prisma, supabase, hasDatabaseUrl };
