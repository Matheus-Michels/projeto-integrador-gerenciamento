export default function Home() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white p-10 border border-zinc-200 shadow-sm rounded-xl">
        <h1 className="text-3xl font-black mb-4 uppercase tracking-tighter text-black">Visão Geral</h1>
        <p className="text-zinc-500 mb-10 text-lg font-light leading-relaxed">
          Bem-vindo ao sistema de gerenciamento de atividades. Utilize o painel lateral para navegar pelas funcionalidades e analisar métricas do GitHub.
        </p>
        
        <div className="bg-zinc-50 border-2 border-zinc-200 p-4 h-48 flex items-center justify-center text-zinc-400 border-dashed transition-all hover:border-black hover:text-black cursor-pointer rounded-lg">
          <span className="uppercase tracking-widest text-sm font-semibold">Área do formulário de busca</span>
        </div>
      </div>
    </div>
  );
}