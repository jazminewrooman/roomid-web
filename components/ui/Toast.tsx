"use client";

import { useEffect, useRef } from "react";

type ToastProps = {
  message: string;
  type?: "success" | "info" | "error";
  onDismiss: () => void;
};

export function Toast({ message, type = "info", onDismiss }: ToastProps) {
  const dismissRef = useRef(onDismiss);
  dismissRef.current = onDismiss;

  useEffect(() => {
    const timer = setTimeout(() => dismissRef.current(), 3500);
    return () => clearTimeout(timer);
  }, []);

  const icon = {
    success: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="8" cy="8" r="7" strokeWidth="1.5" />
        <path d="M4.5 8.5l2.5 2.5 4.5-5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    info: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="8" cy="8" r="7" strokeWidth="1.5" />
        <path d="M8 7v5" strokeWidth="2" strokeLinecap="round" />
        <circle cx="8" cy="4.5" r="1" fill="currentColor" />
      </svg>
    ),
    error: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="8" cy="8" r="7" strokeWidth="1.5" />
        <path d="M5.5 5.5l5 5M10.5 5.5l-5 5" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  }[type];

  return (
    <div className={`toast toast-${type}`} role="status" aria-live="polite">
      <span className="toast-icon">{icon}</span>
      <span className="toast-message">{message}</span>
      <button
        className="toast-close"
        onClick={onDismiss}
        aria-label="Dismiss notification"
        type="button"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M2 2l8 8M10 2l-8 8" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}
