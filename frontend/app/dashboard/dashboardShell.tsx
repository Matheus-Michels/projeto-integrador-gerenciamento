"use client";

import { useState } from "react";
import Link from "next/link";
import Sidebar from "./Sidebar";
import ThemeToggle from "./themeToggle";

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar open={open} onClose={() => setOpen(false)} />

      <div className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-200">
        <header className="h-16 px-4 md:px-8 flex items-center justify-between gap-2 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 transition-colors duration-200">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setOpen(true)}
              aria-label="Abrir menu"
              className="md:hidden text-xl text-black dark:text-white cursor-pointer"
            >
              ☰
            </button>
            <h2 className="text-sm font-bold tracking-wider text-black dark:text-white uppercase truncate">
              Painel de Controle
            </h2>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <ThemeToggle />
            <Link
              href="/login"
              className="px-3 sm:px-4 py-2 bg-black dark:bg-white text-white dark:text-black text-xs font-bold rounded-md hover:bg-zinc-800 dark:hover:bg-zinc-200 transition whitespace-nowrap"
            >
              FAZER LOGIN
            </Link>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}