// Pre-launch switch: hides login/account access and the (currently seed/mock)
// events + booking flow from public navigation while the site goes live with
// real visitors, without deleting any of that code. Flip
// NEXT_PUBLIC_PRELAUNCH_MODE=false (or unset it) once real trainers/sessions
// and user accounts are ready, then remove this flag's usages.
export const PRELAUNCH_MODE = process.env.NEXT_PUBLIC_PRELAUNCH_MODE !== "false";
