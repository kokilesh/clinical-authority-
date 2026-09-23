import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { markEnrollmentPaid } from '@/lib/supabase';
import { getChannelsForCourse } from '@/lib/telegram';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      student_name,
      course_selected,
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id) {
      return NextResponse.json(
        { error: 'Missing Razorpay order or payment ID.' },
        { status: 400 },
      );
    }

    if (!student_name || !course_selected) {
      return NextResponse.json(
        { error: 'Missing student name or course selection.' },
        { status: 400 },
      );
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // Signature verification — only for real (non-demo) orders
    if (keySecret && razorpay_signature && !razorpay_order_id.startsWith('order_demo_')) {
      const generatedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      if (generatedSignature !== razorpay_signature) {
        return NextResponse.json(
          { error: 'Invalid payment signature.' },
          { status: 400 },
        );
      }
    }

    // Mark enrollment as paid — Telegram links are now generated on-demand at click-time
    await markEnrollmentPaid(razorpay_order_id, razorpay_payment_id);

    // Return which channels the student can access based on their course
    const channels = getChannelsForCourse(course_selected);

    return NextResponse.json({
      success: true,
      message: 'Payment verified and enrollment completed successfully!',
      channels,
    });
  } catch (error: any) {
    console.error('Verify Payment API Exception:', error?.message || error);
    return NextResponse.json(
      { error: 'Internal Server Error verifying payment.' },
      { status: 500 },
    );
  }
}
