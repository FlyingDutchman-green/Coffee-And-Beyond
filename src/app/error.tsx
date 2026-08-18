"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Route error caught by error boundary:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-canvas-secondary flex items-center justify-center p-6 text-text-primary">
      <div className="max-w-md w-full bg-canvas-primary border border-border-subtle rounded-lg p-6 sm:p-8 text-center space-y-6 shadow-xs">
        <div className="w-12 h-12 rounded-full bg-[#FDF6F5] border border-[#ECCEC9] text-[#8C3426] flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6 stroke-[1.5]" />
        </div>

        <div className="space-y-2">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-[#8C3426]">
            Application Notice
          </span>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1E1E1C]">
            Something Didn&apos;t Brew Right
          </h1>
          <p className="text-xs text-text-muted leading-relaxed">
            We encountered an unexpected error while preparing this view. You can attempt to reload the view or return to the main lobby.
          </p>
          {error.digest && (
            <p className="font-mono text-[10px] text-text-muted pt-1">
              Error Reference: #{error.digest}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold bg-[#1E1E1C] text-white rounded-md hover:bg-[#3A3A37] transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto px-4 py-2.5 text-xs font-medium bg-canvas-secondary border border-border-subtle rounded-md text-text-primary hover:bg-[#EFEFEA] transition-colors flex items-center justify-center gap-1.5"
          >
            <Home className="w-3.5 h-3.5 text-text-muted" />
            <span>Return to Lobby</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
