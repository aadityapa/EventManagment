"use client";

import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

interface FormTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  hint?: string;
}

const fieldStyles =
  "flex h-11 w-full rounded-lg border border-[var(--glitz-border)] bg-[var(--glitz-surface-elevated,var(--glitz-card))] px-4 py-2 text-sm text-[var(--glitz-text)] placeholder:text-[var(--glitz-muted)]/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--glitz-gold)] focus-visible:border-[var(--glitz-gold)]/50 disabled:cursor-not-allowed disabled:opacity-50";

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, hint, id, className, required, ...props }, ref) => {
    const inputId = id ?? props.name;
    return (
      <div className="space-y-1.5">
        <label htmlFor={inputId} className="block text-sm font-medium text-[var(--glitz-text)]">
          {label}
          {required && <span className="ml-0.5 text-[var(--color-error,#ef4444)]" aria-hidden="true">*</span>}
        </label>
        <input
          ref={ref}
          id={inputId}
          required={required}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          className={cn(fieldStyles, error && "border-[var(--color-error,#ef4444)]", className)}
          {...props}
        />
        {hint && !error && (
          <p id={`${inputId}-hint`} className="text-xs text-[var(--glitz-muted)]">{hint}</p>
        )}
        {error && (
          <p id={`${inputId}-error`} role="alert" className="text-xs text-[var(--color-error,#ef4444)]">{error}</p>
        )}
      </div>
    );
  }
);
FormInput.displayName = "FormInput";

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ label, error, hint, id, className, required, rows = 4, ...props }, ref) => {
    const inputId = id ?? props.name;
    return (
      <div className="space-y-1.5">
        <label htmlFor={inputId} className="block text-sm font-medium text-[var(--glitz-text)]">
          {label}
          {required && <span className="ml-0.5 text-[var(--color-error,#ef4444)]" aria-hidden="true">*</span>}
        </label>
        <textarea
          ref={ref}
          id={inputId}
          rows={rows}
          required={required}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          className={cn(
            fieldStyles,
            "min-h-[120px] resize-y py-3",
            error && "border-[var(--color-error,#ef4444)]",
            className
          )}
          {...props}
        />
        {hint && !error && (
          <p id={`${inputId}-hint`} className="text-xs text-[var(--glitz-muted)]">{hint}</p>
        )}
        {error && (
          <p id={`${inputId}-error`} role="alert" className="text-xs text-[var(--color-error,#ef4444)]">{error}</p>
        )}
      </div>
    );
  }
);
FormTextarea.displayName = "FormTextarea";
