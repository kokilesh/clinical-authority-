import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { generateSingleChannelLink, getChannelsForCourse } from '@/lib/telegram';

/**
 * POST /api/telegram/generate-link
 *
 * Called at click-time from the success page. Verifies enrollment
 * is paid, then generates a fresh 15-minute single-use invite link
 * for the requested channel.
 *
 * Body: { razorpay_order_id, channel, student_name }
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { razorpay_order_id, channel, student_name } = body;

    if (!razorpay_order_id || !channel || !student_name) {
      return NextResponse.json(
        { error: 'Missing required fields.' },
        { status: 400 },
      );
    }

    // --- Verify payment status ---
    let courseSelected: string | null = null;

    if (supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from('enrollments')
        .select('payment_status, course_selected')
        .eq('razorpay_order_id', razorpay_order_id)
        .single();

      if (error || !data) {
        return NextResponse.json(
          { error: 'Enrollment record not found.' },
          { status: 404 },
        );
      }

      if (data.payment_status !== 'paid') {
        return NextResponse.json(
          { error: 'Payment has not been confirmed for this enrollment.' },
          { status: 403 },
        );
      }

      courseSelected = data.course_selected;
    } else {
      // Dev fallback — trust the request when Supabase is not configured
      courseSelected = channel === 'Pharmacology' || channel === 'Pathology'
        ? channel
        : 'Combined';
    }

    // Verify the requested channel is included in the purchased course
    const allowedChannels = getChannelsForCourse(courseSelected || 'Combined');
    if (!allowedChannels.includes(channel)) {
      return NextResponse.json(
        { error: `Your enrollment does not include access to the ${channel} channel.` },
        { status: 403 },
      );
    }

    // Generate a fresh 15-minute invite link
    const inviteLink = await generateSingleChannelLink(student_name, channel);

    return NextResponse.json({
      success: true,
      invite_link: inviteLink,
    });
  } catch (error: any) {
    console.error('Generate Link API Error:', error?.message || error);
    return NextResponse.json(
      { error: 'Failed to generate invite link. Please try again.' },
      { status: 500 },
    );
  }
}
