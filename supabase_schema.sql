-- Supabase Schema for Clinical Authority Enrollments
-- Execute this SQL in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.enrollments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_name TEXT NOT NULL,
    college_name TEXT NOT NULL,
    city TEXT,
    roll_number TEXT,
    course_selected TEXT NOT NULL,
    signature_name TEXT NOT NULL,
    agreed_to_terms BOOLEAN NOT NULL DEFAULT true,
    amount NUMERIC(10, 2) NOT NULL,
    razorpay_order_id TEXT UNIQUE NOT NULL,
    razorpay_payment_id TEXT,
    payment_status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'paid', 'failed'
    telegram_invite_link TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for fast lookup by order ID
CREATE INDEX IF NOT EXISTS idx_enrollments_razorpay_order_id ON public.enrollments(razorpay_order_id);

-- Index for lookup by payment ID
CREATE INDEX IF NOT EXISTS idx_enrollments_razorpay_payment_id ON public.enrollments(razorpay_payment_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts for checkout creation
CREATE POLICY "Allow public insert to enrollments" 
ON public.enrollments 
FOR INSERT 
WITH CHECK (true);

-- Allow service role full access
CREATE POLICY "Allow service role full access" 
ON public.enrollments 
FOR ALL 
USING (true);

-- ─────────────────────────────────────────────────────────────────────────────
-- Free Trial Registrations Table
-- Run this in your Supabase SQL Editor to enable the Free Trial feature.
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.free_trial_registrations (
    id          UUID    DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name   TEXT    NOT NULL,
    college     TEXT    NOT NULL,
    batch       TEXT    NOT NULL,
    email       TEXT    NOT NULL,
    phone       TEXT    NOT NULL,          -- stored as 10-digit string, no country code
    plan        TEXT    NOT NULL DEFAULT 'free_trial',
    consent     BOOLEAN NOT NULL DEFAULT true,
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    -- Prevent duplicate registrations
    CONSTRAINT uq_ftr_email UNIQUE (email),
    CONSTRAINT uq_ftr_phone UNIQUE (phone)
);

-- Indexes for fast duplicate checks
CREATE INDEX IF NOT EXISTS idx_ftr_email ON public.free_trial_registrations(email);
CREATE INDEX IF NOT EXISTS idx_ftr_phone ON public.free_trial_registrations(phone);

-- Enable Row Level Security
ALTER TABLE public.free_trial_registrations ENABLE ROW LEVEL SECURITY;

-- PUBLIC: no read access (only you via service role / Supabase Dashboard can read)
-- No SELECT policy = nobody can read without service role key.

-- PUBLIC: no insert either — all writes go through the API route (server-side, service role)
-- This means the table is fully private. Only your backend API can write to it.

-- ADMIN (service role) gets full access automatically — no policy needed.

-- ─── CSV Export ───────────────────────────────────────────────────────────────
-- To export all free trial registrations as CSV, go to:
--   Supabase Dashboard → Table Editor → free_trial_registrations → Export as CSV
-- Or run this query in the SQL Editor and click "Download CSV":
--   SELECT full_name, college, batch, email, phone, plan, created_at
--   FROM public.free_trial_registrations
--   ORDER BY created_at DESC;

