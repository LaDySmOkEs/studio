// src/app/subscription/actions.ts
'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
  typescript: true,
});

const createCheckoutSessionInput = z.object({
  plan: z.string(),
  price: z.number().positive(),
  priceId: z.string(), // The Price ID from your Stripe Dashboard
});

export async function createCheckoutSession(
  input: z.infer<typeof createCheckoutSessionInput>
): Promise<{ error: string } | void> {
  try {
    const validatedInput = createCheckoutSessionInput.parse(input);
    const { plan, priceId } = validatedInput;

    const successUrl = `${process.env.NEXT_PUBLIC_APP_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${process.env.NEXT_PUBLIC_APP_URL}/subscription/cancel`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      // In a real app, you would associate the checkout session with a logged-in user
      // For example:
      // client_reference_id: userId,
      // customer_email: userEmail,
      metadata: {
        plan: plan,
      },
    });

    if (session.url) {
      redirect(session.url);
    } else {
      return { error: 'Could not create a checkout session. Please try again.' };
    }
  } catch (error) {
    console.error('Stripe Checkout Error:', error);
    if (error instanceof z.ZodError) {
      return { error: `Invalid input: ${error.errors.map((e) => e.message).join(', ')}` };
    }
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    // Don't redirect here, just return the error so the client can handle it
    return { error: `Stripe error: ${errorMessage}` };
  }
}
