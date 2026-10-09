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
        <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
          <span className="lux-label mb-4">Something went wrong</span>
          <h1 className="font-display text-h2 text-lux-white">We&apos;re working on it</h1>
          <p className="mt-4 max-w-md text-lux-subtle">
            An unexpected error occurred. Please refresh the page or return home.
          </p>
          <div className="mt-8 flex gap-4">
            <button
              type="button"
              onClick={() => this.setState({ hasError: false })}
              className="luxury-button luxury-button--purple luxury-button--compact"
            >
              Try Again
            </button>
            <Link href="/" className="luxury-button luxury-button--ghost luxury-button--compact">
              Go Home
            </Link>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
