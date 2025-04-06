const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const stripe = require('stripe');

// Load environment variables
dotenv.config();

const app = express();
const stripeClient = stripe(process.env.STRIPE_SECRET_KEY);

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:5173', 'http://localhost:5174'];

// Development-only CORS configuration
app.use(cors({
  origin: true, // Allow all origins
  credentials: true
}));

app.use(express.json());

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend server is running!' });
});

// Create payment intent route with better error handling
app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency = 'usd', metadata } = req.body;

    // Log the request data for debugging
    console.log('Received payment intent request:', {
      amount,
      currency,
      metadata
    });

    // Validate amount
    if (!amount || isNaN(amount)) {
      console.error('Invalid amount:', amount);
      return res.status(400).json({ 
        error: 'Invalid amount provided',
        details: { receivedAmount: amount }
      });
    }

    // Create a PaymentIntent
    const paymentIntent = await stripeClient.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    console.log('Payment intent created successfully:', paymentIntent.id);
    res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Detailed error in create-payment-intent:', {
      message: error.message,
      type: error.type,
      stack: error.stack
    });
    res.status(500).json({ 
      error: error.message,
      type: error.type
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Allowed origins:', allowedOrigins);
  console.log('Stripe key loaded:', process.env.STRIPE_SECRET_KEY ? 'Yes' : 'No');
}); 