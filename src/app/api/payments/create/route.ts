import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

// Create payment intent
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Morate biti prijavljeni' },
        { status: 401 }
      );
    }

    const data = await req.json();
    const { type, itemId, currency = 'rsd' } = data;

    let amount = 0;
    let description = '';

    if (type === 'course') {
      const course = await prisma.course.findUnique({
        where: { id: itemId },
      });
      if (!course) {
        return NextResponse.json(
          { error: 'Kurs nije pronađen' },
          { status: 404 }
        );
      }
      amount = currency === 'eur' ? course.priceEur : course.priceRsd;
      description = `Kupovina kursa: ${course.title}`;
    } else if (type === 'subscription') {
      amount = currency === 'eur' ? 17 : 1999; // ~17 EUR for 1999 RSD
      description = 'Mesečna pretplata - Institut Biznisa';
    } else if (type === 'verification') {
      amount = currency === 'eur' ? 10 : 1170; // ~10 EUR
      description = 'Verifikacija naloga - Institut Biznisa';
    } else {
      return NextResponse.json(
        { error: 'Nevažeći tip plaćanja' },
        { status: 400 }
      );
    }

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        userId: session.user.id,
        type,
        amount,
        currency,
        description,
        status: 'pending',
      },
    });

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Stripe expects amount in cents
      currency: currency === 'eur' ? 'eur' : 'rsd',
      automatic_payment_methods: { enabled: true },
      metadata: {
        paymentId: payment.id,
        userId: session.user.id,
        type,
        itemId: itemId || '',
      },
    });

    // Update payment with Stripe ID
    await prisma.payment.update({
      where: { id: payment.id },
      data: { stripeId: paymentIntent.id },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentId: payment.id,
    });
  } catch (error) {
    console.error('Error creating payment:', error);
    return NextResponse.json(
      { error: 'Greška prilikom kreiranja plaćanja' },
      { status: 500 }
    );
  }
}
