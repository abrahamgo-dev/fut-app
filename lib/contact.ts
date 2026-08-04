// Once FC's public WhatsApp Business number, in wa.me format (no "+", no
// spaces). This is the dialable number customers message — distinct from
// META_WHATSAPP_PHONE_NUMBER_ID in .env, which is Meta's internal Graph API
// identifier used by the auto-reply webhook (see app/api/whatsapp/route.ts).
export const WHATSAPP_NUMBER = "19563062241";

export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
