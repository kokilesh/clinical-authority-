import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// ── Supabase admin client (service role — never exposed to the browser) ──────
function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

// ── Input validation helpers ─────────────────────────────────────────────────
function sanitize(str: string): string {
  return str.trim().replace(/\s+/g, ' ');
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone: string): boolean {
  // Accept 10 digits, optionally preceded by +91 or 0
  const cleaned = phone.replace(/[\s\-().]/g, '');
  return /^(\+91|91|0)?[6-9]\d{9}$/.test(cleaned);
}

function normalizePhone(phone: string): string {
  const cleaned = phone.replace(/[\s\-().]/g, '');
  // Strip country code prefix and return 10-digit number
  return cleaned.replace(/^(\+91|91|0)/, '');
}

// ── POST /api/free-trial/register ────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const full_name   = sanitize(body.full_name   ?? '');
    const college     = sanitize(body.college      ?? '');
    const batch       = sanitize(body.batch        ?? '');
    const email       = sanitize(body.email        ?? '').toLowerCase();
    const phone_raw   = sanitize(body.phone        ?? '');
    const consent     = body.consent;

    // ── Server-side validation ───────────────────────────────────────────────
    const errors: string[] = [];

    if (full_name.length < 2)         errors.push('Full name must be at least 2 characters.');
    if (!college)                     errors.push('College name is required.');
    if (!batch)                       errors.push('Batch / year is required.');
    if (!isValidEmail(email))         errors.push('Please enter a valid email address.');
    if (!isValidPhone(phone_raw))     errors.push('Please enter a valid 10-digit Indian mobile number.');
    if (consent !== true)             errors.push('You must accept the consent checkbox.');

    if (errors.length > 0) {
      return NextResponse.json({ success: false, error: errors.join(' ') }, { status: 400 });
    }

    const phone = normalizePhone(phone_raw);

    // ── Supabase duplicate check & insert ────────────────────────────────────
    const supabase = getAdminClient();

    if (!supabase) {
      // Supabase not configured — dev fallback: just return success so the
      // frontend can still be tested without credentials set up.
      console.warn('[FreeTrial] Supabase not configured — dev fallback, not saving to DB.');
      return NextResponse.json({ success: true, dev_fallback: true });
    }

    // Check for existing registration by email OR phone
    const { data: existing, error: checkErr } = await supabase
      .from('free_trial_registrations')
      .select('id, email, phone')
      .or(`email.eq.${email},phone.eq.${phone}`)
      .limit(1);

    if (checkErr) {
      console.error('[FreeTrial] Duplicate check error:', checkErr);
      return NextResponse.json(
        { success: false, error: 'Registration check failed. Please try again.' },
        { status: 500 }
      );
    }

    if (existing && existing.length > 0) {
      const dup = existing[0];
      const field = dup.email === email ? 'email address' : 'phone number';
      return NextResponse.json(
        {
          success: false,
          duplicate: true,
          error: `This ${field} is already registered for the free trial. Check your Telegram for the join link.`,
        },
        { status: 409 }
      );
    }

    // Insert new registration
    const { error: insertErr } = await supabase
      .from('free_trial_registrations')
      .insert({
        full_name,
        college,
        batch,
        email,
        phone,
        plan: 'free_trial',
        consent: true,
        created_at: new Date().toISOString(),
      });

    if (insertErr) {
      console.error('[FreeTrial] Insert error:', insertErr);
      // Supabase unique constraint violation (race condition duplicate)
      if (insertErr.code === '23505') {
        return NextResponse.json(
          {
            success: false,
            duplicate: true,
            error: 'This email or phone is already registered for the free trial.',
          },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { success: false, error: 'Could not save registration. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[FreeTrial] Unexpected error:', err);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
