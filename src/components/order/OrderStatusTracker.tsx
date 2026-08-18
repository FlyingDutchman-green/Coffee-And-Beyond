"use client";

import React from "react";
import { OrderStatus } from "@/types/order";
import {
  Clock,
  CheckCircle,
  Coffee,
  Sparkles,
  CheckCheck,
  XCircle,
} from "lucide-react";

interface OrderStatusTrackerProps {
  status: OrderStatus;
}

interface StepConfig {
  key: OrderStatus;
  label: string;
  shortLabel: string;
  description: string;
  icon: React.ElementType;
}

const STEPS: StepConfig[] = [
  {
    key: "NEW",
    label: "Pesanan Diterima",
    shortLabel: "Diterima",
    description: "Pesanan telah masuk ke sistem antrean kasir.",
    icon: Clock,
  },
  {
    key: "CONFIRMED",
    label: "Pembayaran Terverifikasi",
    shortLabel: "Diverifikasi",
    description: "Pembayaran telah diverifikasi kasir. Pesanan masuk ke antrean barista dan dapur.",
    icon: CheckCircle,
  },
  {
    key: "PREPARING",
    label: "Sedang Disiapkan",
    shortLabel: "Disiapkan",
    description: "Barista dan dapur sedang meracik hidangan Anda.",
    icon: Coffee,
  },
  {
    key: "READY",
    label: "Siap Diantar",
    shortLabel: "Siap Diantar",
    description: "Pesanan telah selesai dan sedang diantar ke meja Anda.",
    icon: Sparkles,
  },
  {
    key: "COMPLETED",
    label: "Selesai",
    shortLabel: "Selesai",
    description: "Selamat menikmati hidangan di Coffee And Beyond.",
    icon: CheckCheck,
  },
];

export function OrderStatusTracker({ status }: OrderStatusTrackerProps) {
  if (status === "CANCELLED") {
    return (
      <div className="p-5 rounded-lg bg-[#FDF6F5] border border-[#ECCEC9] text-[#8C3426] space-y-2">
        <div className="flex items-center gap-2">
          <XCircle className="w-5 h-5" />
          <h3 className="font-semibold text-base">Pesanan Dibatalkan</h3>
        </div>
        <p className="text-xs leading-relaxed">
          Pesanan ini telah dibatalkan oleh kasir. Jika terjadi kekeliruan, silakan hubungi staf atau kasir kami.
        </p>
      </div>
    );
  }

  const currentStepIndex = STEPS.findIndex((s) => s.key === status);
  const activeStep = STEPS[currentStepIndex] || STEPS[0];

  return (
    <div className="bg-canvas-primary border border-border-subtle rounded-lg p-5 sm:p-6 space-y-6">
      {/* Current Active Status Headline */}
      <div className="space-y-1 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm text-xs font-semibold uppercase tracking-wider mb-1 border border-border-subtle bg-canvas-secondary text-text-primary">
          <span className="w-2 h-2 rounded-full bg-accent-warm animate-pulse" />
          <span>{activeStep.shortLabel}</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
          {activeStep.label}
        </h2>
        <p className="text-xs sm:text-sm text-text-muted max-w-sm mx-auto leading-relaxed">
          {activeStep.description}
        </p>
      </div>

      {/* Progress Stepper Line */}
      <div className="relative pt-2 pb-2">
        {/* Horizontal Line between steps */}
        <div className="absolute top-6 left-6 right-6 h-[2px] bg-border-subtle -z-0" />
        <div
          className="absolute top-6 left-6 h-[2px] bg-charcoal transition-all duration-500 -z-0"
          style={{
            width: `${(Math.max(0, currentStepIndex) / (STEPS.length - 1)) * 100}%`,
          }}
        />

        <div className="grid grid-cols-5 gap-1 relative z-10">
          {STEPS.map((step, idx) => {
            const isCompleted = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            const StepIcon = step.icon;

            return (
              <div
                key={step.key}
                className="flex flex-col items-center text-center gap-2"
              >
                <div
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center border transition-all duration-200 ${
                    isCurrent
                      ? "bg-charcoal text-white border-charcoal shadow-sm ring-4 ring-black/5"
                      : isCompleted
                      ? "bg-canvas-secondary text-text-primary border-charcoal font-bold"
                      : "bg-canvas-primary text-text-muted border-border-subtle"
                  }`}
                >
                  <StepIcon className="w-4 h-4" />
                </div>
                <span
                  className={`text-[10px] sm:text-xs leading-tight line-clamp-1 ${
                    isCurrent
                      ? "font-bold text-text-primary"
                      : isCompleted
                      ? "font-medium text-text-primary"
                      : "text-text-muted"
                  }`}
                >
                  {step.shortLabel}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
