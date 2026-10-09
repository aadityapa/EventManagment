/**
 * The one reply commitment, worded two ways. Every page that states reply
 * hours uses one of these so the promise never drifts (Sundays excluded).
 *
 * Kept in its own dependency-free module so client components (the inquiry
 * form) can import it without pulling content.ts — and with it the image
 * curation tables — into the browser bundle.
 */
export const BRAND_REPLY_HOURS = "A planner replies the same day for inquiries received Monday to Saturday, 9am–9pm IST.";
export const BRAND_REPLY_HOURS_SHORT = "Same-day reply, Mon–Sat 9am–9pm IST";
