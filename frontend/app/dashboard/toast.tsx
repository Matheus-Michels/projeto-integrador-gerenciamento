"use client";

import { useEffect, useState } from "react";

interface ToastProps {
    message: string;
    type: "success" | "error" | "info";
    onClose: () => void;
    duration?: number;
}

export default function Toast({
    message,
    type = "error",
    onClose,
    duration = 4000,
}: ToastProps) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [onClose, duration]);

    const borderColors = {
        success: "border-emerald-500/30 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/80 dark:border-emerald-800 dark:text-emerald-200",
        error: "border-red-500/30 bg-red-50 text-red-900 dark:bg-red-950/80 dark:border-red-800 dark:text-red-200",
        info: "border-zinc-300 bg-white text-zinc-900 dark:bg-zinc-900 dark:border-zinc-800 dark:text-white",
    };

    return (
        <div
            role="alert"
            className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow backdrop-blur-sm transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 ${borderColors[type]}`}
        >
            <span className="text-base">
                {type === "error" ? "⚠️" : type === "success" ? "✅" : "ℹ️"}
            </span>
            <p className="text-sm font-medium pr-2">{message}</p>
            <button
                onClick={onClose}
                className="ml-auto text-xs opacity-60 hover:opacity-100 transition p-1"
                aria-label="Fechar"
            >
                ✖️
            </button>
        </div>
    );
}