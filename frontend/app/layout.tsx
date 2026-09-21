import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dashboard de Atividades",
  description: "Gerenciamento de atividades integradas com GitHub",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased bg-white text-black font-sans">
        <div className="flex h-screen overflow-hidden">
          <aside className="w-64 bg-black text-white flex flex-col hidden md:flex border-r border-zinc-800">
            <div className="p-6 text-lg font-bold border-b border-zinc-900 uppercase tracking-widest">
              Projeto Integrador
            </div>
            <nav className="flex-1 p-4 space-y-1">
              <a href="#" className="block py-3 px-4 rounded-md transition duration-200 bg-white text-black font-medium">Dashboard</a>
              <a href="#" className="block py-3 px-4 rounded-md transition duration-200 hover:bg-zinc-900 text-zinc-400 hover:text-white">Repositórios</a>
              <a href="#" className="block py-3 px-4 rounded-md transition duration-200 hover:bg-zinc-900 text-zinc-400 hover:text-white">Configurações</a>
            </nav>
          </aside>

          <div className="flex-1 flex flex-col">
            <header className="bg-white border-b border-zinc-200 h-20 flex items-center justify-between px-8">
              <h2 className="text-xl font-bold uppercase tracking-tight">Painel de Controle</h2>
              <div className="flex items-center">
                <span className="text-zinc-400 text-xs uppercase tracking-widest font-semibold">Usuário Conectado</span>
              </div>
            </header>
            
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-zinc-50 p-8">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}