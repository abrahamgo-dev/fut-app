// This used to hide login/account access and the booking flow from public
// visitors before launch. That gating is gone now — production always shows
// the full site (there are no real entrenamientos published yet, so there's
// nothing to actually pay for regardless).
//
// What's left: a local-only convenience switch. When true, panel/cuenta
// seeds fake reservations/sessions so the account and admin panel have
// something to look at without needing real bookings. It can never be true
// in production, no matter the env var. Reuses the NEXT_PUBLIC_PRELAUNCH_MODE
// env var name (rather than introducing a new one) so hosting config doesn't
// need to change.
export const USE_TEST_DATA =
  process.env.NODE_ENV !== "production" &&
  process.env.NEXT_PUBLIC_PRELAUNCH_MODE !== "false";
