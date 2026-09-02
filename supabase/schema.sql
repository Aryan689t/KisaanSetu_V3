-- ==============================================================================
-- KisanSetu Phase 1: Database Foundation Schema & Seed Script
-- Target Database: Supabase PostgreSQL
-- Instructions: Run this entire script in your Supabase Project -> SQL Editor
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. TABLE: centres
CREATE TABLE IF NOT EXISTS public.centres (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    district TEXT NOT NULL,
    state TEXT NOT NULL DEFAULT 'Haryana',
    address TEXT,
    distance_km NUMERIC(5,2),
    lat NUMERIC(9,6),
    lng NUMERIC(9,6),
    operating_hours TEXT DEFAULT '08:00 AM - 06:00 PM',
    active_counters INTEGER DEFAULT 4,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. TABLE: bookings
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token TEXT NOT NULL UNIQUE,
    centre_id TEXT NOT NULL REFERENCES public.centres(id) ON DELETE RESTRICT,
    farmer_name TEXT NOT NULL,
    mobile TEXT,
    aadhaar_last4 TEXT DEFAULT '4821',
    crop_name TEXT NOT NULL,
    slot_time TEXT NOT NULL,
    expected_qty NUMERIC(10,2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'WAITING' CHECK (status IN ('WAITING', 'CHECKED_IN', 'PROCESSING', 'COMPLETED', 'CANCELLED')),
    counter TEXT DEFAULT 'Counter 2',
    actual_qty NUMERIC(10,2),
    moisture_percent NUMERIC(5,2),
    quality_grade TEXT,
    rate_per_quintal NUMERIC(10,2) DEFAULT 2200,
    total_payout NUMERIC(12,2),
    payment_status TEXT DEFAULT 'PENDING' CHECK (payment_status IN ('PENDING', 'PENDING_DISBURSAL', 'DISBURSED')),
    dbt_reference TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. INDEXES
CREATE INDEX IF NOT EXISTS idx_bookings_centre_id ON public.bookings(centre_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_token ON public.bookings(token);

-- 5. ROW LEVEL SECURITY (RLS) & PRIVILEGES FOR HACKATHON MVP DEMO
-- Enable RLS and grant public access so the frontend anon key can perform queries & updates without blocking demo flows.
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON TABLE public.centres TO anon, authenticated;
GRANT ALL ON TABLE public.bookings TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

ALTER TABLE public.centres ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    -- Centres Policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'centres' AND policyname = 'Allow public read centres') THEN
        CREATE POLICY "Allow public read centres" ON public.centres FOR SELECT TO anon, authenticated USING (true);
    END IF;

    -- Bookings Policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'bookings' AND policyname = 'Allow public read bookings') THEN
        CREATE POLICY "Allow public read bookings" ON public.bookings FOR SELECT TO anon, authenticated USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'bookings' AND policyname = 'Allow public insert bookings') THEN
        CREATE POLICY "Allow public insert bookings" ON public.bookings FOR INSERT TO anon, authenticated WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'bookings' AND policyname = 'Allow public update bookings') THEN
        CREATE POLICY "Allow public update bookings" ON public.bookings FOR UPDATE TO anon, authenticated USING (true);
    END IF;
END $$;

-- 6. SEED DATA: centres (Sonipat, Karnal, Panipat, Rohtak)
INSERT INTO public.centres (id, name, district, state, address, distance_km, lat, lng, operating_hours, active_counters)
VALUES
    ('cnt-sonipat', 'Sonipat Main Procurement Centre', 'Sonipat', 'Haryana', 'G.T. Road, Sector 15, Near Grain Market, Sonipat', 6.2, 28.993100, 77.015100, '08:00 AM - 06:00 PM', 4),
    ('cnt-karnal', 'Karnal Grain Mandi Hub', 'Karnal', 'Haryana', 'Old Grain Market Yard, GT Road, Karnal', 14.5, 29.685700, 76.990500, '07:30 AM - 07:00 PM', 6),
    ('cnt-panipat', 'Panipat Sub-Mandi Procurement Yard', 'Panipat', 'Haryana', 'Industrial Area Phase 2, Near Bypass, Panipat', 9.8, 29.390900, 76.963500, '08:00 AM - 05:30 PM', 3),
    ('cnt-rohtak', 'Rohtak Kisan Procurement Hub', 'Rohtak', 'Haryana', 'Delhi Road, Opp. New Agriculture Office, Rohtak', 18.0, 28.895500, 76.606600, '08:00 AM - 06:00 PM', 4)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    district = EXCLUDED.district,
    state = EXCLUDED.state,
    address = EXCLUDED.address,
    distance_km = EXCLUDED.distance_km,
    lat = EXCLUDED.lat,
    lng = EXCLUDED.lng,
    operating_hours = EXCLUDED.operating_hours,
    active_counters = EXCLUDED.active_counters;

-- 7. SEED DATA: bookings (SNP-011 through SNP-015)
-- Ensures SNP-014 (Ramesh Singh) exists as WAITING in Sonipat Mandi
INSERT INTO public.bookings (
    token, centre_id, farmer_name, mobile, aadhaar_last4, crop_name, slot_time, expected_qty, 
    status, counter, actual_qty, moisture_percent, quality_grade, rate_per_quintal, total_payout, payment_status, dbt_reference
)
VALUES
    (
        'SNP-011', 'cnt-sonipat', 'Harpreet Singh', '+91 98765 11111', '1092', 'Paddy (Grade A)', '09:00 AM - 09:30 AM', 45.00,
        'COMPLETED', 'Counter 1', 44.20, 11.50, 'Grade A', 2200.00, 97240.00, 'DISBURSED', 'DBT-UTIB000762111'
    ),
    (
        'SNP-012', 'cnt-sonipat', 'Jaipal Yadav', '+91 98765 22222', '3184', 'Paddy (Grade A)', '09:30 AM - 10:00 AM', 30.00,
        'COMPLETED', 'Counter 1', 29.80, 12.10, 'Grade A', 2200.00, 65560.00, 'DISBURSED', 'DBT-UTIB000762112'
    ),
    (
        'SNP-013', 'cnt-sonipat', 'Baldev Ram', '+91 98765 33333', '9041', 'Paddy (Grade A)', '10:00 AM - 10:30 AM', 50.00,
        'CHECKED_IN', 'Counter 2', NULL, NULL, NULL, 2200.00, NULL, 'PENDING', NULL
    ),
    (
        'SNP-014', 'cnt-sonipat', 'Ramesh Singh (YOU)', '+91 98765 43210', '4821', 'Paddy (Grade A)', '11:00 AM - 11:30 AM', 40.00,
        'WAITING', 'Counter 2', NULL, NULL, NULL, 2200.00, NULL, 'PENDING', NULL
    ),
    (
        'SNP-015', 'cnt-sonipat', 'Vikramjit Sharma', '+91 98765 55555', '6720', 'Paddy (Grade A)', '11:30 AM - 12:00 PM', 35.00,
        'WAITING', 'Unassigned', NULL, NULL, NULL, 2200.00, NULL, 'PENDING', NULL
    )
ON CONFLICT (token) DO UPDATE SET
    centre_id = EXCLUDED.centre_id,
    farmer_name = EXCLUDED.farmer_name,
    mobile = EXCLUDED.mobile,
    aadhaar_last4 = EXCLUDED.aadhaar_last4,
    crop_name = EXCLUDED.crop_name,
    slot_time = EXCLUDED.slot_time,
    expected_qty = EXCLUDED.expected_qty,
    status = EXCLUDED.status,
    counter = EXCLUDED.counter,
    actual_qty = EXCLUDED.actual_qty,
    moisture_percent = EXCLUDED.moisture_percent,
    quality_grade = EXCLUDED.quality_grade,
    rate_per_quintal = EXCLUDED.rate_per_quintal,
    total_payout = EXCLUDED.total_payout,
    payment_status = EXCLUDED.payment_status,
    dbt_reference = EXCLUDED.dbt_reference;
