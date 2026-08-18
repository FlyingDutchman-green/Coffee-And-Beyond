"use client";

import React, { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";

interface QRCodeGeneratorProps {
  tableId: string;
  size?: number;
  className?: string;
  fgColor?: string;
  bgColor?: string;
  includeMargin?: boolean;
  id?: string;
}

export function QRCodeGenerator({
  tableId,
  size = 140,
  className = "",
  fgColor = "#1E1E1C",
  bgColor = "#FFFFFF",
  includeMargin = false,
  id,
}: QRCodeGeneratorProps) {
  const [origin, setOrigin] = useState<string>(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  );

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.origin) {
      setOrigin(window.location.origin);
    }
  }, []);

  const normalized = tableId.trim().toUpperCase();
  const orderUrl = `${origin}/order/${normalized}`;
  const elementId = id || `qr-svg-${normalized}`;

  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <QRCodeSVG
        id={elementId}
        value={orderUrl}
        size={size}
        level="M"
        fgColor={fgColor}
        bgColor={bgColor}
        includeMargin={includeMargin}
      />
    </div>
  );
}
