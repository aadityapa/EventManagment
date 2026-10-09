import type { Request, Response } from "express";
import { z } from "zod";

/**
 * Request validation + error helpers shared by every route.
 *
 * Rules enforced here (see server/README.md):
 *  - 400s carry a generic message plus flattened per-field errors — never a
 *    raw Zod issue tree, which leaks schema internals.
 *  - 500s never echo `err.message`; the detail is logged server-side only.
 */

export type FieldErrors = Record<string, string[] | undefined>;

export function sendValidationError(res: Response, err: z.ZodError, message = "Invalid request") {
  const { fieldErrors, formErrors } = err.flatten();
  const fields: FieldErrors = { ...fieldErrors };
  if (formErrors.length) fields._form = formErrors;
  res.status(400).json({ error: message, fields });
}

/**
 * Parse `req.body` with `schema`. On failure a 400 is sent and `undefined` is
 * returned, so handlers can `if (!data) return;`.
 */
export function parseBody<T extends z.ZodTypeAny>(schema: T, req: Request, res: Response): z.infer<T> | undefined {
  const result = schema.safeParse(req.body ?? {});
  if (!result.success) {
    sendValidationError(res, result.error);
    return undefined;
  }
  return result.data;
}

/** Same as {@link parseBody} for `req.query` (read-only in Express 5, so we never mutate it). */
export function parseQuery<T extends z.ZodTypeAny>(schema: T, req: Request, res: Response): z.infer<T> | undefined {
  const result = schema.safeParse(req.query ?? {});
  if (!result.success) {
    sendValidationError(res, result.error, "Invalid query");
    return undefined;
  }
  return result.data;
}

export function logError(scope: string, err: unknown) {
  const detail = err instanceof Error ? `${err.name}: ${err.message}` : String(err);
  console.error(`[${scope}] ${detail}`);
  if (process.env.NODE_ENV !== "production" && err instanceof Error && err.stack) {
    console.error(err.stack);
  }
}

/** Log the real error, answer with a generic message. */
export function sendServerError(res: Response, scope: string, err: unknown, message = "Something went wrong") {
  logError(scope, err);
  if (!res.headersSent) res.status(500).json({ error: message });
}

/* ---- Reusable field schemas -------------------------------------------- */

export const emailSchema = z.string().trim().toLowerCase().email().max(254);
export const phoneSchema = z
  .string()
  .trim()
  .min(6)
  .max(20)
  .regex(/^[+\d\s()-]+$/, "Invalid phone number");
export const shortText = (max = 120) => z.string().trim().min(1).max(max);
export const longText = (max = 5000) => z.string().trim().max(max);
export const idSchema = z.string().trim().min(1).max(64);
/** ISO-8601 date or date-time string that parses to a real date. */
export const dateStringSchema = z
  .string()
  .trim()
  .refine((v) => !Number.isNaN(new Date(v).getTime()), "Invalid date");
/** Query-string number ("250000" -> 250000). */
export const queryNumber = (min: number, max: number) => z.coerce.number().min(min).max(max);
