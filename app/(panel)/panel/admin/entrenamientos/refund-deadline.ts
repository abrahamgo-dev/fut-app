// Admins get a week after the entrenamiento's start time to cancel it and
// have refunds go out automatically. There's no Stripe-side reason for this
// (a captured charge stays refundable for months) — it's a deliberate
// business cutoff so an old, long-settled class can't be reopened and
// refunded by mistake. Past the cutoff, do it by hand from the Stripe
// dashboard.
//
// Lives outside actions.ts because a "use server" file may only export async
// functions — this plain helper is shared by the server action and the page
// that decides whether to render the cancel button at all.
const CANCEL_REFUND_DEADLINE_DAYS = 7;

export function getCancelRefundDeadline(startsAt: Date): Date {
  return new Date(startsAt.getTime() + CANCEL_REFUND_DEADLINE_DAYS * 24 * 60 * 60 * 1000);
}
