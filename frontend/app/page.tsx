"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [owner, setOwner] = useState("");
  const [repo, setRepo] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
  e.preventDefault();
  const cleanOwner = owner.trim().toLowerCase();
  const cleanRepo = repo.trim().toLowerCase();

  if (cleanOwner && cleanRepo) {
    router.push(`/dashboard/${cleanOwner}/${cleanRepo}`);
  }
};


  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="bg-white p-10 border border-zinc-200 shadow-sm rounded-xl">
        <h1 className="text-3xl font-black mb-4 uppercase tracking-tighter text-black">Visão Geral</h1>
        <p className="text-zinc-500 mb-10 text-lg font-light leading-relaxed">
          Bem-vindo ao sistema de gerenciamento de atividades. Insira os dados do repositório abaixo para gerar o relatório.
        </p>

        <form onSubmit={handleSearch} className="flex gap-4">
          <input
            type="text"
            placeholder="Dono (ex: facebook)"
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
            className="flex-1 px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-lg text-black focus:outline-none focus:border-black transition-colors"
            required
          />
          <input
            type="text"
            placeholder="Repositório (ex: react)"
            value={repo}
            onChange={(e) => setRepo(e.target.value)}
            className="flex-1 px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-lg text-black focus:outline-none focus:border-black transition-colors"
            required
          />
          <button
            type="submit"
            className="px-8 py-3 bg-black text-white font-bold uppercase tracking-widest rounded-lg hover:bg-zinc-800 transition-colors"
          >
            Pesquisar
          </button>
        </form>
      </div>
    </div>
  );
}