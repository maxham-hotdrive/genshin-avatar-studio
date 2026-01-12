import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

// Initialize Stripe with secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia'
})

// Initialize Supabase client with service role key
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Webhook secret from Stripe Dashboard
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    // Get the raw body as text (required for Stripe signature verification)
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
      console.error('Missing stripe-signature header')
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      )
    }

    // Verify webhook signature
    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json(
        { error: `Webhook signature verification failed: ${err instanceof Error ? err.message : 'Unknown error'}` },
        { status: 400 }
      )
    }

    console.log(`Received webhook event: ${event.type}`)

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session)
        break

      case 'checkout.session.expired':
        await handleCheckoutSessionExpired(event.data.object as Stripe.Checkout.Session)
        break

      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent)
        break

      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

/**
 * Handle successful checkout session completion
 */
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const generationId = session.metadata?.generation_id

  if (!generationId) {
    console.error('No generation_id in session metadata')
    return
  }

  console.log(`Checkout completed for generation: ${generationId}`)

  try {
    // Update payment record
    const { error: paymentError } = await supabase
      .from('payments')
      .update({
        status: 'succeeded',
        stripe_payment_intent_id: session.payment_intent as string,
        customer_email: session.customer_email,
        paid_at: new Date().toISOString(),
        metadata: {
          session_id: session.id,
          payment_status: session.payment_status,
          amount_total: session.amount_total,
          currency: session.currency
        }
      })
      .eq('stripe_session_id', session.id)

    if (paymentError) {
      console.error('Failed to update payment record:', paymentError)
      // Try to insert new payment record if update failed (shouldn't happen)
      const { error: insertError } = await supabase
        .from('payments')
        .insert({
          generation_id: generationId,
          stripe_session_id: session.id,
          stripe_payment_intent_id: session.payment_intent as string,
          amount: session.amount_total || 1500,
          currency: session.currency || 'usd',
          status: 'succeeded',
          customer_email: session.customer_email,
          paid_at: new Date().toISOString(),
          metadata: {
            session_id: session.id,
            payment_status: session.payment_status
          }
        })

      if (insertError) {
        console.error('Failed to insert payment record:', insertError)
      }
    }

    // Update generation record to mark as paid
    const { error: generationError } = await supabase
      .from('generations')
      .update({
        paid: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', generationId)

    if (generationError) {
      console.error('Failed to update generation record:', generationError)
    }

    console.log(`Successfully processed payment for generation: ${generationId}`)

  } catch (error) {
    console.error('Error handling checkout session completed:', error)
  }
}

/**
 * Handle expired checkout session
 */
async function handleCheckoutSessionExpired(session: Stripe.Checkout.Session) {
  const generationId = session.metadata?.generation_id

  if (!generationId) {
    console.error('No generation_id in session metadata')
    return
  }

  console.log(`Checkout expired for generation: ${generationId}`)

  try {
    // Update payment record to mark as expired
    const { error } = await supabase
      .from('payments')
      .update({
        status: 'expired',
        metadata: {
          session_id: session.id,
          expired_at: new Date().toISOString()
        }
      })
      .eq('stripe_session_id', session.id)

    if (error) {
      console.error('Failed to update payment record:', error)
    }

  } catch (error) {
    console.error('Error handling checkout session expired:', error)
  }
}

/**
 * Handle successful payment intent (redundant check after checkout.session.completed)
 */
async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log(`Payment intent succeeded: ${paymentIntent.id}`)

  try {
    // Update payment record with payment intent details
    const { error } = await supabase
      .from('payments')
      .update({
        status: 'succeeded',
        stripe_payment_intent_id: paymentIntent.id,
        metadata: {
          payment_method: paymentIntent.payment_method,
          amount_received: paymentIntent.amount_received
        }
      })
      .eq('stripe_payment_intent_id', paymentIntent.id)

    if (error) {
      console.error('Failed to update payment record:', error)
    }

  } catch (error) {
    console.error('Error handling payment intent succeeded:', error)
  }
}

/**
 * Handle failed payment intent
 */
async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.log(`Payment intent failed: ${paymentIntent.id}`)

  try {
    // Update payment record to mark as failed
    const { error } = await supabase
      .from('payments')
      .update({
        status: 'failed',
        metadata: {
          failure_code: paymentIntent.last_payment_error?.code,
          failure_message: paymentIntent.last_payment_error?.message
        }
      })
      .eq('stripe_payment_intent_id', paymentIntent.id)

    if (error) {
      console.error('Failed to update payment record:', error)
    }

  } catch (error) {
    console.error('Error handling payment intent failed:', error)
  }
}
