async function getCommits() {
  const res = await fetch('http://localhost:3000/github/facebook/react/commits', { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Falha ao buscar os dados da API');
  }
  return res.json();
}

export default async function Home() {
  const commits = await getCommits();

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="bg-white p-10 border border-zinc-200 shadow-sm rounded-xl">
        <h1 className="text-3xl font-black mb-4 uppercase tracking-tighter text-black">Visão Geral</h1>
        <p className="text-zinc-500 mb-10 text-lg font-light leading-relaxed">
          Bem-vindo ao sistema de gerenciamento de atividades. Abaixo você confere as últimas atualizações do repositório pesquisado.
        </p>

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