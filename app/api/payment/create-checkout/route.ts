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

interface CheckoutRequest {
  generationId: string
  config: {
    style: string
    gender: string
    hairStyle: string
    hairColor: string
    eyeColor: string
    traits: string[]
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CheckoutRequest = await request.json()
    const { generationId, config } = body

    // Validate required fields
    if (!generationId || !config) {
      return NextResponse.json(
        { error: 'Missing required fields: generationId and config' },
        { status: 400 }
      )
    }

    // Verify the generation exists and is completed
    const { data: generation, error: generationError } = await supabase
      .from('generations')
      .select('id, status, zip_url')
      .eq('id', generationId)
      .single()

    if (generationError || !generation) {
      return NextResponse.json(
        { error: 'Generation not found' },
        { status: 404 }
      )
    }

    if (generation.status !== 'completed') {
      return NextResponse.json(
        { error: 'Generation not completed yet' },
        { status: 400 }
      )
    }

    // Check if payment already exists for this generation
    const { data: existingPayment } = await supabase
      .from('payments')
      .select('id, status, stripe_session_id')
      .eq('generation_id', generationId)
      .single()

    // If payment already succeeded, redirect to download
    if (existingPayment && existingPayment.status === 'succeeded') {
      return NextResponse.json({
        alreadyPaid: true,
        downloadUrl: `/download?generation_id=${generationId}`
      })
    }

    // If payment is pending, return existing checkout session
    if (existingPayment && existingPayment.stripe_session_id) {
      return NextResponse.json({
        sessionId: existingPayment.stripe_session_id,
        url: `https://checkout.stripe.com/c/pay/${existingPayment.stripe_session_id}`
      })
    }

    // Create line item description with character details
    const characterDesc = `${config.gender === 'female' ? 'Female' : 'Male'} character with ${config.hairColor} ${config.hairStyle} hair and ${config.eyeColor} eyes${
      config.traits.length > 0 ? `, featuring ${config.traits.join(', ')}` : ''
    }`

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Genshin Impact Avatar Pack',
              description: characterDesc,
              images: ['https://your-domain.com/avatar-preview.png'], // TODO: Add actual preview image
              metadata: {
                style: config.style,
                gender: config.gender,
                hairStyle: config.hairStyle,
                hairColor: config.hairColor,
                eyeColor: config.eyeColor,
                traits: config.traits.join(',')
              }
            },
            unit_amount: 1500, // $15.00 in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_URL}/download?generation_id=${generationId}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/configure?style=${config.style}`,
      metadata: {
        generation_id: generationId,
        config: JSON.stringify(config)
      },
      // Enable automatic tax calculation (optional)
      automatic_tax: { enabled: false },
      // Collect customer email for receipt
      customer_email: undefined, // User can enter email at checkout
      // Session expires after 24 hours
      expires_at: Math.floor(Date.now() / 1000) + (24 * 60 * 60),
    })

    // Create payment record in database
    const { error: paymentError } = await supabase
      .from('payments')
      .insert({
        generation_id: generationId,
        stripe_session_id: session.id,
        amount: 1500,
        currency: 'usd',
        status: 'pending',
        metadata: {
          config,
          session_url: session.url
        }
      })

    if (paymentError) {
      console.error('Failed to create payment record:', paymentError)
      // Continue anyway - webhook will handle this
    }

    // Return checkout session URL
    return NextResponse.json({
      sessionId: session.id,
      url: session.url
    })

  } catch (error) {
    console.error('Checkout creation error:', error)

    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: `Stripe error: ${error.message}` },
        { status: error.statusCode || 500 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
