import Link from "next/link";
import ThemeToggle from "./themeToggle";

async function getFavorites() {
  try {
    const res = await fetch("http://localhost:3000/favorites", {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    return [];
  }
}

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const favorites = await getFavorites();

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Menu Lateral (Aside) */}
      <aside className="w-64 bg-black text-white flex flex-col h-full border-r border-zinc-800">
        <div className="p-6 text-lg font-bold border-b border-zinc-800">
          Projeto Integrador
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <Link
            href="/dashboard"
            className="block py-3 px-4 rounded-lg font-medium text-white hover:bg-zinc-900 transition"
          >
            Dashboard
          </Link>

          <div className="pt-6 pb-2">
            <p className="px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              Repositórios Salvos
            </p>
          </div>

          <div className="space-y-1">
            {favorites.length > 0 ? (
              favorites.map((fav: any) => (
                <Link
                  key={fav.id || `${fav.owner}/${fav.repo}`}
                  href={`/dashboard?repo=${fav.owner}/${fav.repo}`}
                  className="block py-2 px-4 rounded text-sm text-zinc-400 hover:text-white hover:bg-zinc-900 transition truncate"
                >
                  {fav.repo}
                </Link>
              ))
            ) : (
              <p className="px-4 py-2 text-xs text-zinc-600 italic">
                Nenhum favorito salvo
              </p>
            )}
          </div>

          <div className="pt-6">
            <Link
              href="/dashboard/configuracoes"
              className="block py-2.5 px-4 rounded text-sm text-zinc-400 hover:text-white hover:bg-zinc-900 transition"
            >
              Configurações
            </Link>
          </div>
        </nav>

        {/* Rodapé do Menu Lateral */}
        <div className="p-4 border-t border-zinc-800 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-xs text-white">
            N
          </div>
        </div>
      </aside>

      {/* Conteúdo Principal (Barra Superior + Main com Dark Mode) */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-200">
        {/* Barra Superior */}
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

        {/* Área de Visualização das Páginas */}
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}