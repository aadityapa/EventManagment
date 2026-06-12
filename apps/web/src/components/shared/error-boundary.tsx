"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import Link from "next/link";
import { captureException } from "@/lib/monitoring/sentry";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    captureException(error, { componentStack: info.componentStack });
    if (process.env.NODE_ENV === "development") {
      console.error("ErrorBoundary caught:", error, info.componentStack);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="brand-root flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
          <span className="brand-label mb-4">Something went wrong</span>
          <h1 className="brand-display text-3xl font-bold">We&apos;re working on it</h1>
          <p className="mt-4 max-w-md text-muted">
            An unexpected error occurred. Please refresh the page or return home.
          </p>
          <div className="mt-8 flex gap-4">
            <button
              type="button"
              onClick={() => this.setState({ hasError: false })}
              className="btn-gold-metallic rounded-lg px-6 py-3 text-sm font-semibold"
            >
              Try Again
            </button>
            <Link href="/" className="rounded-lg border border-[var(--glitz-border)] px-6 py-3 text-sm font-semibold text-primary hover:border-[var(--glitz-gold)]">
              Go Home
            </Link>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
