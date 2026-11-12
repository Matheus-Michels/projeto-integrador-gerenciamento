import { FavoritesProvider } from "@/components/FavoritesProvider";
import Sidebar from "./Sidebar";
import Link from "next/link";
import ThemeToggle from "./themeToggle";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FavoritesProvider>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />

        <div className="flex-1 flex flex-col h-screen overflow-hidden bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-200">
          <header className="h-16 px-8 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 transition-colors duration-200">
            <h2 className="text-sm font-bold tracking-wider text-black dark:text-white uppercase">
              Painel de Controle
            </h2>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Link
                href="/login"
                className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black text-xs font-bold rounded-md hover:bg-zinc-800 dark:hover:bg-zinc-200 transition"
              >
                FAZER LOGIN
              </Link>
            </div>
          </header>
          <main className="flex-1 overflow-y-auto p-8">{children}</main>
        </div>
      </div>
    </FavoritesProvider>
  );
}
