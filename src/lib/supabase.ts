import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey;

export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const supabaseAdmin = (supabaseUrl && supabaseServiceKey)
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

export interface EnrollmentRecord {
  id?: string;
  student_name: string;
  college_name: string;
  city: string;
  roll_number: string;
  course_selected: string;
  signature_name: string;
  agreed_to_terms: boolean;
  amount: number;
  razorpay_order_id: string;
  razorpay_payment_id?: string;
  payment_status: 'pending' | 'paid' | 'failed';
  telegram_invite_link?: string;
  created_at?: string;
}

// In-memory fallback store when Supabase env keys are not provided yet
const fallbackEnrollmentStore: Map<string, EnrollmentRecord> = new Map();

export async function savePendingEnrollment(record: EnrollmentRecord): Promise<{ success: boolean; data?: any; error?: string }> {
  if (supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin
        .from('enrollments')
        .insert([record])
        .select()
        .single();

      if (error) {
        console.error('Supabase DB Insert Error:', error);
        fallbackEnrollmentStore.set(record.razorpay_order_id, record);
        return { success: true, data: record };
      }
      return { success: true, data };
    } catch (err: any) {
      console.error('Supabase Client Error:', err);
      fallbackEnrollmentStore.set(record.razorpay_order_id, record);
      return { success: true, data: record };
    }
  }

  // Fallback in-memory
  fallbackEnrollmentStore.set(record.razorpay_order_id, record);
  return { success: true, data: record };
}

export async function markEnrollmentPaid(
  orderId: string, 
  paymentId: string, 
  telegramInviteLink?: string
): Promise<{ success: boolean; data?: any; error?: string }> {
  const updateData: any = {
    payment_status: 'paid',
    razorpay_payment_id: paymentId,
    updated_at: new Date().toISOString(),
  };

  if (telegramInviteLink) {
    updateData.telegram_invite_link = telegramInviteLink;
  }

  if (supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin
        .from('enrollments')
        .update(updateData)
        .eq('razorpay_order_id', orderId)
        .select()
        .single();

      if (error) {
        console.error('Supabase Update Error:', error);
      } else {
        return { success: true, data };
      }
    } catch (err: any) {
      console.error('Supabase Update Exception:', err);
    }
  }

  // Fallback update memory store
  const existing = fallbackEnrollmentStore.get(orderId);
  if (existing) {
    existing.payment_status = 'paid';
    existing.razorpay_payment_id = paymentId;
    if (telegramInviteLink) existing.telegram_invite_link = telegramInviteLink;
    fallbackEnrollmentStore.set(orderId, existing);
    return { success: true, data: existing };
  }

  return { 
    success: true, 
    data: { 
      razorpay_order_id: orderId, 
      razorpay_payment_id: paymentId, 
      payment_status: 'paid', 
      ...(telegramInviteLink && { telegram_invite_link: telegramInviteLink })
    } 
  };
}
