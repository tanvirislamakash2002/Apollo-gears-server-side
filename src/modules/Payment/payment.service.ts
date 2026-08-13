import Stripe from 'stripe';
import { prisma } from '../../lib/prisma';
import AppError from '../../errors/AppError';
import config from '../../config';
import { CreatePaymentPayload } from './payment.interface';

const stripe = new Stripe(config.stripe_secret_key || '', { apiVersion: '2025-02-24.acacia' as any });

export const PaymentService = {
  async createCheckoutSession(userId: string, payload: CreatePaymentPayload) {
    const rent = await prisma.rent.findFirst({
      where: { id: payload.rentId, userId },
      include: { car: true },
    });

    if (!rent) {
      throw new AppError(404, 'Rent not found');
    }

    const amount = Number(payload.amount || rent.bids[0]?.bidAmount || 0);
    if (!amount || amount <= 0) {
      throw new AppError(400, 'Invalid payment amount');
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: (payload.currency || 'usd').toLowerCase(),
            unit_amount: Math.round(amount * 100),
            product_data: {
              name: `${rent.car.brand} ${rent.car.model}`,
              description: `Rental payment for ${rent.startingPoint} to ${rent.destination}`,
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${config.stripe_success_url}?rentId=${rent.id}`,
      cancel_url: `${config.stripe_cancel_url}?rentId=${rent.id}`,
      metadata: {
        userId,
        rentId: rent.id,
      },
    });

    const payment = await prisma.payment.create({
      data: {
        userId,
        rentId: rent.id,
        amount,
        currency: (payload.currency || 'usd').toLowerCase(),
        status: 'PENDING',
        stripeSessionId: session.id,
      },
    });

    return { payment, checkoutUrl: session.url };
  },

  async handleWebhook(rawBody: Buffer, signature: string | undefined) {
    if (!config.stripe_secret_key || !config.stripe_webhook_secret) {
      throw new AppError(500, 'Stripe not configured');
    }

    const event = stripe.webhooks.constructEvent(rawBody, signature || '', config.stripe_webhook_secret);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const rentId = session.metadata?.rentId;
      const userId = session.metadata?.userId;
      const paymentIntentId = session.payment_intent as string | undefined;

      if (rentId && userId) {
        await prisma.payment.updateMany({
          where: { rentId, userId },
          data: {
            status: 'SUCCEEDED',
            stripePaymentIntentId: paymentIntentId,
            paidAt: new Date(),
          },
        });
      }
    }

    return { received: true };
  },

  async getPayments(userId: string) {
    return prisma.payment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  },
};

export default PaymentService;
