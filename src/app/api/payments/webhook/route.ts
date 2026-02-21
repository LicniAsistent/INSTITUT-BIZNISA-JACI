import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export async function POST(req: NextRequest) {
  try {
    const payload = await req.text();
    const signature = req.headers.get('stripe-signature') || '';

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return NextResponse.json(
        { error: 'Webhook signature verification failed' },
        { status: 400 }
      );
    }

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const { paymentId, userId, type, itemId } = paymentIntent.metadata;

      // Update payment status
      await prisma.payment.update({
        where: { id: paymentId },
        data: { status: 'completed' },
      });

      // Handle different payment types
      if (type === 'course' && itemId) {
        // Create enrollment
        await prisma.enrollment.create({
          data: {
            userId,
            courseId: itemId,
          },
        });

        // Add XP for course purchase
        await prisma.user.update({
          where: { id: userId },
          data: { xp: { increment: 500 } },
        });

        await prisma.xpLog.create({
          data: {
            userId,
            amount: 500,
            reason: 'Kupovina kursa',
          },
        });
      } else if (type === 'subscription') {
        // Update subscription
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 1);

        await prisma.user.update({
          where: { id: userId },
          data: {
            subscriptionStatus: 'active',
            subscriptionEnd: endDate,
          },
        });

        // Add XP for subscription
        await prisma.user.update({
          where: { id: userId },
          data: { xp: { increment: 200 } },
        });

        await prisma.xpLog.create({
          data: {
            userId,
            amount: 200,
            reason: 'Mesečna pretplata',
          },
        });
      } else if (type === 'verification') {
        // Mark verification as paid
        await prisma.user.update({
          where: { id: userId },
          data: {
            verificationStatus: 'pending',
          },
        });
      }
    } else if (event.type === 'payment_intent.payment_failed') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const { paymentId } = paymentIntent.metadata;

      await prisma.payment.update({
        where: { id: paymentId },
        data: { status: 'failed' },
      });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook error' },
      { status: 500 }
    );
  }
}
