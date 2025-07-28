// src/services/stripeConfig.js

import { loadStripe } from '@stripe/stripe-js';

const STRIPE_PUBLIC_KEY = 'pk_test_51RZpFvQ63F9T6ItYM0NO3FsXrp29sn4dmh2I4mHtHk94Cj9Slo0aYVF4V1LFHFAb56nubn8i8VuYIcvQEgWpwBdc009UY7KNcm';

console.log('🔵 Loading Stripe with key...');

// Încarcă Stripe simplu, fără opțiuni complicate
const stripePromise = loadStripe(STRIPE_PUBLIC_KEY)
  .then(stripe => {
    if (stripe) {
      console.log('✅ Stripe loaded successfully');
      return stripe;
    } else {
      console.error('❌ Stripe returned null');
      return null;
    }
  })
  .catch(error => {
    console.error('❌ Failed to load Stripe:', error);
    return null;
  });

// Funcție simplă pentru a verifica dacă Stripe este gata
export const isStripeReady = async () => {
  try {
    const stripe = await stripePromise;
    const isReady = stripe !== null && stripe !== undefined;
    console.log('🔵 Stripe readiness check:', isReady);
    return isReady;
  } catch (error) {
    console.error('❌ Error checking Stripe readiness:', error);
    return false;
  }
};

export default stripePromise;