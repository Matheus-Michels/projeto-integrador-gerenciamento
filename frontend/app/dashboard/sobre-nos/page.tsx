export default function SobreNosPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Cabeçalho */}
      <div className="bg-white dark:bg-zinc-900 p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm rounded-xl transition-colors duration-200">
        <h1 className="text-3xl font-black uppercase tracking-tighter text-black dark:text-white">
          Sobre nós
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm font-light mt-2">
          Informações sobre o projeto e a equipe de desenvolvimento.
        </p>
      </div>

      {/* Sobre o Projeto */}
      <div className="bg-white dark:bg-zinc-900 p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm rounded-xl transition-colors duration-200">
        <h2 className="text-xl font-bold text-black dark:text-white mb-4">
          O Projeto
        </h2>
        <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed mb-4">
          O <strong>Sistema de Gerenciamento de Atividades</strong> é um painel
          de métricas e produtividade desenvolvido para extrair, filtrar e
          visualizar atividades de repositórios do GitHub (Commits, Pull Requests
          e Issues).
        </p>
        <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed">
          Este projeto foi desenvolvido na disciplina de{" "}
          <strong>Projeto Integrador</strong> do curso de Ciência da Computação
          da <strong>UTFPR</strong>.
        </p>
      </div>

      {/* Equipe */}
      <div className="bg-white dark:bg-zinc-900 p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm rounded-xl transition-colors duration-200">
        <h2 className="text-xl font-bold text-black dark:text-white mb-6">
          Equipe
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex items-center gap-4 p-4 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700">
            <div className="w-12 h-12 rounded-full bg-zinc-800 dark:bg-zinc-700 flex items-center justify-center font-bold text-white text-lg">
              M
            </div>
            <div>
              <p className="font-semibold text-black dark:text-white">
                Matheus Vinicius Faria Michels
              </p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Desenvolvedor
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700">
            <div className="w-12 h-12 rounded-full bg-zinc-800 dark:bg-zinc-700 flex items-center justify-center font-bold text-white text-lg">
              T
            </div>
            <div>
              <p className="font-semibold text-black dark:text-white">
                Thales Natan De Oliveira Nascimento
              </p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Desenvolvedor
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tecnologias */}
      <div className="bg-white dark:bg-zinc-900 p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm rounded-xl transition-colors duration-200">
        <h2 className="text-xl font-bold text-black dark:text-white mb-4">
          Tecnologias
        </h2>
        <div className="flex flex-wrap gap-2">
          {[
            "Next.js",
            "TypeScript",
            "Tailwind CSS",
            "NestJS",
            "PostgreSQL",
            "SuperTokens",
            "Recharts",
            "Docker",
          ].map((tech) => (
            <span
              key={tech}
              className="px-3 py-1.5 text-xs font-medium rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Links */}
      <div className="bg-white dark:bg-zinc-900 p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm rounded-xl transition-colors duration-200">
        <h2 className="text-xl font-bold text-black dark:text-white mb-4">
          Links
        </h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href="https://github.com/Matheus-Michels/projeto-integrador-gerenciamento"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 transition"
          >
            Repositório no GitHub
          </a>
          <a
            href="https://projeto-integrador-gerenciamento-wine.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition"
          >
            Demo Online
          </a>
        </div>
      </div>
    </div>
  );
}