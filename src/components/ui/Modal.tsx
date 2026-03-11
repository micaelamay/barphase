// ═══════════════════════════════════════════
// BARPHASE UI — MODAL COMPONENT
// ═══════════════════════════════════════════

"use client";

import React, { useEffect } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  width?: "sm" | "md" | "lg";
}

const widthMap = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
};

export function Modal({ open, onClose, title, children, width = "md" }: ModalProps) {
  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Content */}
      <div
        className={`
          relative ${widthMap[width]} w-full
          bg-bp-bg-secondary border border-bp-border rounded-xl
          shadow-2xl shadow-black/50 animate-fade-in
          max-h-[85vh] flex flex-col
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-bp-border flex-shrink-0">
          <h3 className="text-sm font-semibold text-bp-text">{title}</h3>
          <button
            onClick={onClose}
            className="text-bp-text-dim hover:text-bp-text transition-colors text-lg leading-none"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto px-5 py-4 flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}
