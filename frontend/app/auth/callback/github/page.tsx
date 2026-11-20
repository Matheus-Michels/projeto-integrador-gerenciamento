"use client";

import { useEffect, useState } from "react";
import { signInAndUp } from "supertokens-web-js/recipe/thirdparty";

export default function GitHubCallbackPage() {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const response = await signInAndUp();

        if (response.status === "OK") {
          window.location.href = "/dashboard";
        } else if (response.status === "SIGN_IN_UP_NOT_ALLOWED") {
          setError(response.reason || "Login não permitido.");
        } else {
          setError("Não foi possível concluir o login com o GitHub.");
        }
      } catch (err: any) {
        setError(err?.message || "Erro ao autenticar com o GitHub.");
      }
    };

    handleCallback();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 p-6">
      <div className="bg-white p-8 border border-zinc-200 rounded-xl shadow-sm max-w-md w-full text-center">
        {error ? (
          <>
            <h1 className="text-xl font-bold text-red-600 mb-2">
              Erro na autenticação
            </h1>
            <p className="text-sm text-zinc-600 mb-6">{error}</p>
            <a
              href="/login"
              className="inline-block px-6 py-3 bg-black text-white text-xs font-semibold uppercase tracking-widest rounded-lg hover:bg-zinc-800 transition-all"
            >
              Voltar para o Login
            </a>
          </>
        ) : (
          <>
            <h1 className="text-xl font-bold text-black mb-2">
              Autenticando com GitHub...
            </h1>
            <p className="text-sm text-zinc-500">
              Aguarde enquanto concluímos o seu acesso.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
