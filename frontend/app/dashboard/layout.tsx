async function getFavorites() {
  try {
    const res = await fetch('http://localhost:3000/favorites/teste', { 
      cache: 'no-store' 
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
      <aside className="w-64 bg-black text-white flex-col hidden md:flex border-r border-zinc-800">
        <div className="p-6 text-lg font-bold border-b border-zinc-900 uppercase tracking-widest">
          Projeto Integrador
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <a href="/dashboard" className="block py-3 px-4 rounded-md transition duration-200 hover:bg-zinc-900 text-zinc-400 hover:text-white">Dashboard</a>
          
          <div className="pt-6 pb-2">
            <p className="px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Repositórios Salvos</p>
          </div>
          
          {favorites.length > 0 ? (
            favorites.map((fav: any) => (
              <a 
                key={fav.id} 
                href={`/dashboard?repo=${fav.owner}/${fav.repo}`} 
                className="py-2 px-4 rounded-md transition duration-200 hover:bg-zinc-900 text-zinc-300 hover:text-white text-sm truncate flex items-center gap-2"
              >
                <span className="text-yellow-500">★</span> {fav.owner}/{fav.repo}
              </a>
            ))
          ) : (
            <p className="px-4 text-sm text-zinc-600 italic mt-2">Nenhum favorito salvo</p>
          )}

          <div className="pt-6">
            <a href="#" className="block py-3 px-4 rounded-md transition duration-200 hover:bg-zinc-900 text-zinc-400 hover:text-white">Configurações</a>
          </div>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-zinc-200 h-20 flex items-center justify-between px-8">
          <h2 className="text-xl font-bold uppercase tracking-tight text-black">Painel de Controle</h2>
          <div className="flex items-center">
            <a href="/login" className="px-5 py-2 bg-black text-white text-xs uppercase tracking-widest font-bold rounded-lg hover:bg-zinc-800 transition-colors">
              Fazer Login
            </a>
          </div>
        </header>
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-zinc-50 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}