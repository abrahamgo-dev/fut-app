import Stripe from "stripe";

let cached: Stripe | null = null;

export function getStripe(): Stripe {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error(
      "STRIPE_SECRET_KEY no está configurado. Agrega tus llaves de prueba de Stripe a .env.local para habilitar pagos."
    );
  }
  if (!cached) {
    cached = new Stripe(secretKey, { apiVersion: "2026-07-29.dahlia" });
  }
  return cached;
}
