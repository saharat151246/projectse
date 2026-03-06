# E-commerce Project with Payment System

This is a React + Vite frontend for an e-commerce application with integrated Stripe payment processing.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure Stripe:
   - Get your Stripe publishable key from [Stripe Dashboard](https://dashboard.stripe.com/)
   - Update `.env` file:
     ```
     VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key
     ```

3. Start development server:
   ```bash
   npm run dev
   ```

## Payment System

The application integrates Stripe for secure credit card payments:

- **Frontend**: Uses `@stripe/react-stripe-js` for payment form
- **Backend**: Uses `stripe` SDK for payment processing
- **Supported Methods**: Credit/Debit cards, Bank transfer (simulated)

### Testing Payments

Use Stripe test card numbers:
- Success: `4242 4242 4242 4242`
- Declined: `4000 0000 0000 0002`

## Features

- User authentication
- Product catalog
- Shopping cart
- Secure checkout with Stripe
- Order management

## Backend

Make sure to also configure the backend `.env` with your Stripe secret key:
```
STRIPE_SECRET_KEY=sk_test_your_actual_secret_key
```
