import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { markEnrollmentPaid } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const webhookSignature = req.headers.get('x-razorpay-signature');
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    // Webhook signature verification
    if (webhookSecret && webhookSignature) {
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(rawBody)
        .digest('hex');

      if (expectedSignature !== webhookSignature) {
        return NextResponse.json(
          { error: 'Invalid webhook signature.' },
          { status: 400 },
        );
      }
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event;

    if (event === 'payment.captured' || event === 'order.paid') {
      const entity =
        payload.payload.payment?.entity || payload.payload.order?.entity;
      const orderId = entity?.order_id || entity?.id;
      const paymentId = entity?.id;

      if (orderId) {
        // Just mark as paid — Telegram links are generated on-demand
        await markEnrollmentPaid(orderId, paymentId);
      }
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error: any) {
    console.error('Razorpay Webhook Error:', error?.message || error);
    return NextResponse.json(
      { error: 'Webhook processing failed.' },
      { status: 500 },
    );
  }
}
