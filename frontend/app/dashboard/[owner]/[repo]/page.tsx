async function getCommits(owner: string, repo: string) {
  const res = await fetch(`http://localhost:3000/github/${owner}/${repo}/commits`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Falha ao buscar os dados da API');
  }
  return res.json();
}

export default async function DashboardResults({ params }: { params: Promise<{ owner: string; repo: string }> }) {
  const resolvedParams = await params;
  
  const commits = await getCommits(resolvedParams.owner, resolvedParams.repo);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="bg-white p-10 border border-zinc-200 shadow-sm rounded-xl">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter text-black">Relatório de Atividades</h1>
            <p className="text-zinc-500 mt-2">Repositório: <span className="font-bold text-black">{resolvedParams.owner}/{resolvedParams.repo}</span></p>
          </div>
          <a href="/" className="text-sm font-bold uppercase tracking-widest text-zinc-500 hover:text-black transition-colors">← Voltar</a>
        </div>

        <div className="overflow-x-auto rounded-lg border border-zinc-200">
          <table className="w-full text-sm text-left text-zinc-500">
            <thead className="text-xs text-black uppercase bg-zinc-50 border-b border-zinc-200">
              <tr>
                <th scope="col" className="px-6 py-4 font-semibold">Autor</th>
                <th scope="col" className="px-6 py-4 font-semibold">Mensagem</th>
                <th scope="col" className="px-6 py-4 font-semibold">Data</th>
                <th scope="col" className="px-6 py-4 font-semibold text-right">Hash</th>
              </tr>
            </thead>
            <tbody>
              {commits.slice(0, 10).map((item: any) => (
                <tr key={item.sha} className="bg-white border-b border-zinc-100 hover:bg-zinc-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-black">
                    {item.commit.author.name}
                  </td>
                  <td className="px-6 py-4 truncate max-w-xs">
                    {item.commit.message}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(item.commit.author.date).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 text-right font-mono text-xs text-zinc-400">
                    {item.sha.substring(0, 7)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}