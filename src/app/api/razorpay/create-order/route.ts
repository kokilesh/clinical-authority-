import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { savePendingEnrollment } from '@/lib/supabase';

const COURSE_PRICES: Record<string, number> = {
  Pharmacology: 555,
  Pathology: 355,
  Combined: 855,
};

const VALID_COURSES = Object.keys(COURSE_PRICES);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      student_name,
      college_name,
      city,
      roll_number,
      course_selected,
      signature_name,
      agreed_to_terms,
    } = body;

    // --- Input validation ---
    if (!student_name || !college_name || !course_selected || !signature_name || !agreed_to_terms) {
      return NextResponse.json(
        { error: 'Missing required enrollment details or agreement.' },
        { status: 400 }
      );
    }

    if (!VALID_COURSES.includes(course_selected)) {
      return NextResponse.json(
        { error: 'Invalid course selection.' },
        { status: 400 }
      );
    }

    if (student_name.trim().toLowerCase() !== signature_name.trim().toLowerCase()) {
      return NextResponse.json(
        { error: 'Digital signature must match student name.' },
        { status: 400 }
      );
    }

    const price = COURSE_PRICES[course_selected];
    const amountInPaise = Math.round(price * 100);

    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    let orderId = `order_demo_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    // Create real Razorpay order only when credentials are configured
    if (keyId && keySecret) {
      try {
        const razorpay = new Razorpay({
          key_id: keyId,
          key_secret: keySecret,
        });

        const order = await razorpay.orders.create({
          amount: amountInPaise,
          currency: 'INR',
          receipt: `receipt_${Date.now()}`,
          notes: {
            student_name,
            college_name,
            course_selected,
            roll_number: roll_number || '',
          },
        });

        orderId = order.id;
      } catch (rzpErr: any) {
        console.error('Razorpay order creation failed:', rzpErr?.message || rzpErr);
        return NextResponse.json(
          { error: 'Payment gateway is temporarily unavailable. Please try again.' },
          { status: 502 }
        );
      }
    }

    // Save pending enrollment record
    await savePendingEnrollment({
      student_name,
      college_name,
      city: city || '',
      roll_number: roll_number || '',
      course_selected,
      signature_name,
      agreed_to_terms,
      amount: price,
      razorpay_order_id: orderId,
      payment_status: 'pending',
    });

    return NextResponse.json({
      order_id: orderId,
      amount: amountInPaise,
      currency: 'INR',
      key_id: keyId || '',
      course_selected,
      student_name,
    });
  } catch (error: any) {
    console.error('Create Order API Exception:', error?.message || error);
    return NextResponse.json(
      { error: 'Internal Server Error while initializing checkout.' },
      { status: 500 }
    );
  }
}
