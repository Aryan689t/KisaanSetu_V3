-- ==============================================================================
-- Annagati Phase 1: Database Foundation Schema & Seed Script
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

-- 3. TABLE: users
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password TEXT,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'farmer' CHECK (role IN ('farmer', 'operator', 'admin', 'desk')),
    operator_channel TEXT DEFAULT 'online' CHECK (operator_channel IN ('online', 'physical')),
    phone TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. TABLE: bookings
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
    status TEXT NOT NULL DEFAULT 'WAITING' CHECK (status IN ('WAITING', 'CHECKED_IN', 'PROCESSING', 'COMPLETED', 'CANCELLED', 'DRYING_REQUIRED', 'NO_SHOW')),
    booking_type TEXT NOT NULL DEFAULT 'ONLINE' CHECK (booking_type IN ('ONLINE', 'WALK_IN', 'ASSISTED')),
    counter TEXT DEFAULT 'Counter 2',
    actual_qty NUMERIC(10,2),
    moisture_percent NUMERIC(5,2),
    quality_grade TEXT,
    quality_parameters JSONB,
    rate_per_quintal NUMERIC(10,2) DEFAULT 2200,
    total_payout NUMERIC(12,2),
    payment_status TEXT DEFAULT 'PENDING' CHECK (payment_status IN ('PENDING', 'PENDING_DISBURSAL', 'DISBURSED')),
    dbt_reference TEXT,
    arrival_time TIMESTAMPTZ,
    est_time TIMESTAMPTZ,
    suspended_at TIMESTAMPTZ,
    drying_yard_location TEXT,
    freight_subsidy NUMERIC(10,2) DEFAULT 0,
    rerouted_from TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. INDEXES
CREATE INDEX IF NOT EXISTS idx_bookings_centre_id ON public.bookings(centre_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_token ON public.bookings(token);
CREATE INDEX IF NOT EXISTS idx_bookings_booking_type ON public.bookings(booking_type);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_operator_channel ON public.users(operator_channel);

-- 6. ROW LEVEL SECURITY (RLS) & PRIVILEGES FOR DEMO MVP
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON TABLE public.centres TO anon, authenticated;
GRANT ALL ON TABLE public.users TO anon, authenticated;
GRANT ALL ON TABLE public.bookings TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

ALTER TABLE public.centres ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    -- Centres Policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'centres' AND policyname = 'Allow public read centres') THEN
        CREATE POLICY "Allow public read centres" ON public.centres FOR SELECT TO anon, authenticated USING (true);
    END IF;

    -- Users Policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'Allow public read users') THEN
        CREATE POLICY "Allow public read users" ON public.users FOR SELECT TO anon, authenticated USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'Allow public insert users') THEN
        CREATE POLICY "Allow public insert users" ON public.users FOR INSERT TO anon, authenticated WITH CHECK (true);
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

-- 7. SEED DATA: centres (Sonipat, Karnal, Panipat, Rohtak)
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

-- 8. SEED DATA: users (3 Online Operators, 2 Physical Operators, Farmer, Admin)
INSERT INTO public.users (id, email, full_name, role, operator_channel, phone)
VALUES
    ('00000000-0000-0000-0000-000000000001', 'operator.online1@annagati.gov.in', 'Rajesh Kumar (Online Op 1)', 'operator', 'online', '9812345671'),
    ('00000000-0000-0000-0000-000000000002', 'operator.online2@annagati.gov.in', 'Anil Verma (Online Op 2)', 'operator', 'online', '9812345672'),
    ('00000000-0000-0000-0000-000000000003', 'operator.online3@annagati.gov.in', 'Vikas Sharma (Online Op 3)', 'operator', 'online', '9812345673'),
    ('00000000-0000-0000-0000-000000000004', 'operator.physical1@annagati.gov.in', 'Suresh Patel (Physical Op 1)', 'operator', 'physical', '9812345674'),
    ('00000000-0000-0000-0000-000000000005', 'operator.physical2@annagati.gov.in', 'Devender Singh (Physical Op 2)', 'operator', 'physical', '9812345675'),
    ('00000000-0000-0000-0000-000000000006', 'farmer@annagati.gov.in', 'Ramesh Singh (YOU)', 'farmer', 'online', '9876543210'),
    ('00000000-0000-0000-0000-000000000007', 'admin@annagati.gov.in', 'S. K. Sharma (DoCA Admin)', 'admin', 'online', '9811002233')
ON CONFLICT (email) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    operator_channel = EXCLUDED.operator_channel,
    phone = EXCLUDED.phone;

-- 9. SEED DATA: bookings
-- Advance Booking Cohort (Staggered 15-minute appointment slots, distributed across 3 Online Operators)
INSERT INTO public.bookings (
    token, centre_id, farmer_name, mobile, aadhaar_last4, crop_name, slot_time, expected_qty, 
    status, booking_type, counter, actual_qty, moisture_percent, quality_grade, quality_parameters,
    rate_per_quintal, total_payout, payment_status, dbt_reference
)
VALUES
    (
        'SNP-011', 'cnt-sonipat', 'Harpreet Singh', '+91 98120 11452', '3819', 'Paddy (Grade A)', '09:00 AM - 09:15 AM', 45.00,
        'COMPLETED', 'ONLINE', 'Counter 1', 44.20, 11.50, 'Grade A', '{"moisturePercent": 11.5, "foreignMatter": 1.2, "damagedGrains": 1.0, "immatureGrains": 1.1, "admixture": 0.5, "weevilledGrains": 0.2, "allPassed": true}',
        2200.00, 97240.00, 'DISBURSED', 'DBT-UTIB000762111'
    ),
    (
        'SNP-012', 'cnt-sonipat', 'Jaipal Yadav', '+91 98450 78219', '7104', 'Paddy (Grade A)', '09:15 AM - 09:30 AM', 30.00,
        'COMPLETED', 'ONLINE', 'Counter 1', 29.80, 12.10, 'Grade A', '{"moisturePercent": 12.1, "foreignMatter": 1.1, "damagedGrains": 0.8, "immatureGrains": 1.0, "admixture": 0.4, "weevilledGrains": 0.1, "allPassed": true}',
        2200.00, 65560.00, 'DISBURSED', 'DBT-UTIB000762112'
    ),
    (
        'SNP-013', 'cnt-sonipat', 'Baldev Ram', '+91 97280 44102', '9215', 'Paddy (Grade A)', '09:30 AM - 09:45 AM', 50.00,
        'CHECKED_IN', 'ONLINE', 'Counter 2', NULL, NULL, NULL, NULL,
        2200.00, NULL, 'PENDING', NULL
    ),
    (
        'SNP-014', 'cnt-sonipat', 'Ramesh Singh (YOU)', '+91 98765 43210', '4821', 'Paddy (Grade A)', '09:45 AM - 10:00 AM', 40.00,
        'WAITING', 'ONLINE', 'Counter 2', NULL, NULL, NULL, NULL,
        2200.00, NULL, 'PENDING', NULL
    ),
    (
        'SNP-015', 'cnt-sonipat', 'Vikramjit Sharma', '+91 94160 33890', '6320', 'Paddy (Grade A)', '10:00 AM - 10:15 AM', 35.00,
        'WAITING', 'ONLINE', 'Counter 2', NULL, NULL, NULL, NULL,
        2200.00, NULL, 'PENDING', NULL
    ),
    (
        'SNP-016', 'cnt-sonipat', 'Kuldeep Malik', '+91 98132 99014', '5512', 'Paddy (Grade A)', '10:15 AM - 10:30 AM', 55.00,
        'WAITING', 'ONLINE', 'Counter 2', NULL, NULL, NULL, NULL,
        2200.00, NULL, 'PENDING', NULL
    ),
    (
        'SNP-017', 'cnt-sonipat', 'Sube Singh Dahiya', '+91 94668 12450', '8834', 'Paddy (Grade A)', '10:30 AM - 10:45 AM', 42.00,
        'WAITING', 'ONLINE', 'Counter 2', NULL, NULL, NULL, NULL,
        2200.00, NULL, 'PENDING', NULL
    ),

    -- Walk-In Cohort (Arrival time & estimated processing times, handled by 2 Physical Operators)
    (
        'W-020', 'cnt-sonipat', 'Mahesh Kumar', '+91 97291 66540', '6618', 'Paddy (Grade A)', 'Arrived 08:50 • Est. 09:35', 30.00,
        'COMPLETED', 'WALK_IN', 'Counter 2', 30.20, 13.20, 'Grade A', '{"moisturePercent": 13.2, "foreignMatter": 1.4, "damagedGrains": 1.2, "immatureGrains": 1.5, "admixture": 0.8, "weevilledGrains": 0.3, "allPassed": true}',
        2200.00, 66440.00, 'DISBURSED', 'DBT-UTIB000762120'
    ),
    (
        'W-021', 'cnt-sonipat', 'Baldev Singh', '+91 98960 34120', '1904', 'Paddy (Grade A)', 'Arrived 09:05 • Est. 09:50', 45.00,
        'PROCESSING', 'WALK_IN', 'Counter 4', NULL, NULL, NULL, NULL,
        2200.00, NULL, 'PENDING', NULL
    ),
    (
        'W-022', 'cnt-sonipat', 'Ramesh Yadav', '+91 94165 88210', '7732', 'Paddy (Grade A)', 'Arrived 09:12 • Est. 10:05', 35.00,
        'COMPLETED', 'WALK_IN', 'Counter 3', 34.80, 12.80, 'Grade A', '{"moisturePercent": 12.8, "foreignMatter": 1.0, "damagedGrains": 0.9, "immatureGrains": 1.2, "admixture": 0.6, "weevilledGrains": 0.2, "allPassed": true}',
        2200.00, 76560.00, 'DISBURSED', 'DBT-UTIB000762122'
    ),
    (
        'W-023', 'cnt-sonipat', 'Suresh Kumar', '+91 98760 12345', '4821', 'Paddy (Grade A)', 'Arrived 09:18 • Est. 10:20', 40.00,
        'CHECKED_IN', 'WALK_IN', 'Counter 1', NULL, NULL, NULL, NULL,
        2200.00, NULL, 'PENDING', NULL
    ),
    (
        'W-024', 'cnt-sonipat', 'Gurdeep Singh', '+91 98124 55901', '5921', 'Paddy (Grade A)', 'Arrived 09:24 • Est. 10:35', 50.00,
        'PROCESSING', 'WALK_IN', 'Counter 2', NULL, NULL, NULL, NULL,
        2200.00, NULL, 'PENDING', NULL
    ),
    (
        'W-025', 'cnt-sonipat', 'Dharampal Saini', '+91 98129 44321', '3312', 'Paddy (Grade A)', 'Arrived 09:32 • Est. 10:50', 38.00,
        'WAITING', 'WALK_IN', 'Counter 3', NULL, NULL, NULL, NULL,
        2200.00, NULL, 'PENDING', NULL
    ),
    (
        'W-026', 'cnt-sonipat', 'Kishan Lal', '+91 97288 90123', '5421', 'Paddy (Grade A)', 'Arrived 09:40 • Est. 11:05', 48.00,
        'WAITING', 'WALK_IN', 'Counter 1', NULL, NULL, NULL, NULL,
        2200.00, NULL, 'PENDING', NULL
    ),
    (
        'W-027', 'cnt-sonipat', 'Jagdish Chandra', '+91 94162 77890', '9901', 'Paddy (Grade A)', 'Arrived 09:48 • Est. 11:20', 52.00,
        'WAITING', 'WALK_IN', 'Counter 4', NULL, NULL, NULL, NULL,
        2200.00, NULL, 'PENDING', NULL
    ),
    (
        'W-028', 'cnt-sonipat', 'Om Prakash', '+91 98965 22109', '6712', 'Paddy (Grade A)', 'Arrived 09:55 • Est. 11:35', 30.00,
        'WAITING', 'WALK_IN', 'Counter 2', NULL, NULL, NULL, NULL,
        2200.00, NULL, 'PENDING', NULL
    ),
    (
        'W-029', 'cnt-sonipat', 'Satish Kumar', '+91 98131 55678', '2109', 'Paddy (Grade A)', 'Arrived 10:05 • Est. 11:50', 44.00,
        'WAITING', 'WALK_IN', 'Counter 3', NULL, NULL, NULL, NULL,
        2200.00, NULL, 'PENDING', NULL
    ),
    (
        'W-030', 'cnt-sonipat', 'Rohtas Singh', '+91 94670 88901', '4502', 'Paddy (Grade A)', 'Arrived 10:14 • Est. 12:05', 60.00,
        'WAITING', 'WALK_IN', 'Counter 1', NULL, NULL, NULL, NULL,
        2200.00, NULL, 'PENDING', NULL
    ),
    (
        'W-031', 'cnt-sonipat', 'Devender Sharma', '+91 97294 11234', '8910', 'Paddy (Grade A)', 'Arrived 10:22 • Est. 12:20', 36.00,
        'WAITING', 'WALK_IN', 'Counter 4', NULL, NULL, NULL, NULL,
        2200.00, NULL, 'PENDING', NULL
    ),
    (
        'W-032', 'cnt-sonipat', 'Rajinder Prasad', '+91 98120 99876', '1432', 'Paddy (Grade A)', 'Arrived 10:30 • Est. 12:35', 40.00,
        'WAITING', 'WALK_IN', 'Counter 2', NULL, NULL, NULL, NULL,
        2200.00, NULL, 'PENDING', NULL
    ),
    (
        'W-033', 'cnt-sonipat', 'Prem Chand', '+91 98452 33456', '7654', 'Paddy (Grade A)', 'Arrived 10:38 • Est. 12:50', 50.00,
        'WAITING', 'WALK_IN', 'Counter 3', NULL, NULL, NULL, NULL,
        2200.00, NULL, 'PENDING', NULL
    ),
    (
        'W-034', 'cnt-sonipat', 'Anil Tyagi', '+91 94169 66789', '3210', 'Paddy (Grade A)', 'Arrived 10:45 • Est. 01:05', 32.00,
        'WAITING', 'WALK_IN', 'Counter 1', NULL, NULL, NULL, NULL,
        2200.00, NULL, 'PENDING', NULL
    ),
    (
        'W-035', 'cnt-sonipat', 'Bijender Singh', '+91 98961 88902', '9876', 'Paddy (Grade A)', 'Arrived 10:55 • Est. 01:20', 46.00,
        'WAITING', 'WALK_IN', 'Counter 4', NULL, NULL, NULL, NULL,
        2200.00, NULL, 'PENDING', NULL
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
    booking_type = EXCLUDED.booking_type,
    counter = EXCLUDED.counter,
    actual_qty = EXCLUDED.actual_qty,
    moisture_percent = EXCLUDED.moisture_percent,
    quality_grade = EXCLUDED.quality_grade,
    quality_parameters = EXCLUDED.quality_parameters,
    rate_per_quintal = EXCLUDED.rate_per_quintal,
    total_payout = EXCLUDED.total_payout,
    payment_status = EXCLUDED.payment_status,
    dbt_reference = EXCLUDED.dbt_reference;

