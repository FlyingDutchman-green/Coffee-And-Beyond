"use client";

import React, { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global application error:", error);
  }, [error]);

  return (
    <html lang="en" className="h-full">
      <body className="h-full min-h-screen bg-[#F7F7F5] text-[#1E1E1C] flex items-center justify-center p-6 font-sans antialiased">
        <div className="max-w-md w-full bg-white border border-[#E7E7E3] rounded-lg p-6 sm:p-8 text-center space-y-6 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-[#FDF6F5] border border-[#ECCEC9] text-[#8C3426] flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6 stroke-[1.5]" />
          </div>

          <div className="space-y-2">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-[#8C3426]">
              System Interruption
            </span>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1E1E1C]">
              Critical Application Error
            </h1>
            <p className="text-xs text-[#777772] leading-relaxed">
              Coffee And Beyond encountered an unrecoverable system exception. Please reload the entire application.
            </p>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => reset()}
              className="w-full py-2.5 px-4 text-xs font-semibold bg-[#1E1E1C] text-white rounded-md hover:bg-[#3A3A37] transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reload Application</span>
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
