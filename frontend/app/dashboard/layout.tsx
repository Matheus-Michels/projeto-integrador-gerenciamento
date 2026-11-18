import { FavoritesProvider } from "@/components/FavoritesProvider";
import DashboardShell from "./dashboardShell";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FavoritesProvider>
      <DashboardShell>{children}</DashboardShell>
    </FavoritesProvider>
  );
}