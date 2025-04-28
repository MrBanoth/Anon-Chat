import { STRIPE_PRODUCTS } from '../stripe-config';
import { supabase } from './supabase';

export async function createCheckoutSession(priceId: string, mode: 'payment' | 'subscription') {
  const { data: { session } } = await supabase.auth.getSession();

  if (!session?.access_token) {
    throw new Error('No session found');
  }

  const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({
      price_id: priceId,
      success_url: `${window.location.origin}/subscription/success`,
      cancel_url: `${window.location.origin}/subscription`,
      mode,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create checkout session');
  }

  const { url } = await response.json();
  return url;
}

export async function redirectToCheckout(productId: keyof typeof STRIPE_PRODUCTS) {
  const product = STRIPE_PRODUCTS[productId];
  if (!product) {
    throw new Error('Invalid product ID');
  }

  const checkoutUrl = await createCheckoutSession(product.priceId, product.mode);
  window.location.href = checkoutUrl;
}