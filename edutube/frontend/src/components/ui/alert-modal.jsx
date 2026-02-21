"use client";

import React from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { cn } from "@/lib/utils";

/**
 * Centered alert/success modal – use instead of window.alert for success or info messages.
 * Single OK button, themed to match the app.
 */
export function AlertModal({ open, onClose, title = "Success", message, buttonLabel = "OK" }) {
  return (
    <Dialog open={open} onClose={onClose} className="relative z-[100]">
      <DialogBackdrop className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel
          className={cn(
            "relative w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-xl text-card-foreground",
            "focus:outline-none focus:ring-0"
          )}
        >
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{message}</p>
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-0"
            >
              {buttonLabel}
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
