"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, signUp } from "supertokens-web-js/recipe/emailpassword";
import { getAuthorisationURLWithQueryParamsAndSetState } from "supertokens-web-js/recipe/thirdparty";
import SuperTokens from "supertokens-web-js";

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        const response = await signIn({
          formFields: [
            { id: "email", value: email },
            { id: "password", value: password },
          ],
        });

        if (response.status === "FIELD_ERROR") {
          setError(
            response.formFields[0]?.error ||
              "Erro no preenchimento dos campos.",
          );
        } else if (response.status === "WRONG_CREDENTIALS_ERROR") {
          setError("Email ou senha incorretos.");
        } else if (response.status === "OK") {
          window.location.href = "/dashboard";
        }
      } else {
        const response = await signUp({
          formFields: [
            { id: "email", value: email },
            { id: "password", value: password },
          ],
        });

        if (response.status === "FIELD_ERROR") {
          setError(
            response.formFields[0]?.error || "Dados inválidos para registro.",
          );
        } else if (response.status === "OK") {
          window.location.href = "/dashboard";
        }
      }
    } catch (err: any) {
      setError(
        err?.message || "Falha ao conectar com o serviço de autenticação.",
      );
    } finally {
      setLoading(false);
    }
  };

  const githubSignIn = async () => {
    try {
      const authUrl = await getAuthorisationURLWithQueryParamsAndSetState({
        thirdPartyId: "github",
        frontendRedirectURI: "http://localhost:3001/auth/callback/github",
      });
      window.location.assign(authUrl);
    } catch (err: any) {
      setError("Erro ao iniciar login com GitHub.");
    }
  };

  return (
    <div className="max-w-xl mx-auto py-8">
      <div className="bg-white p-10 border border-zinc-200 shadow-sm rounded-xl">
        <h1 className="text-3xl font-black mb-2 uppercase tracking-tighter text-black">
          {isLogin ? "Entrar" : "Cadastrar"}
        </h1>
        <p className="text-zinc-500 mb-8 text-base font-light leading-relaxed">
          {isLogin
            ? "Insira suas credenciais para acessar o painel de atividades."
            : "Preencha os campos abaixo para criar seu acesso ao sistema."}
        </p>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm font-medium text-red-600 border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block uppercase tracking-widest text-xs font-semibold text-zinc-600 mb-2">
              E-mail
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu.email@exemplo.com"
              className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-black placeholder-zinc-400 focus:bg-white focus:border-black focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block uppercase tracking-widest text-xs font-semibold text-zinc-600 mb-2">
              Senha
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-black placeholder-zinc-400 focus:bg-white focus:border-black focus:outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 rounded-lg bg-black py-3.5 text-sm font-semibold uppercase tracking-widest text-white transition-all hover:bg-zinc-800 disabled:opacity-50 cursor-pointer"
          >
            {loading
              ? "Processando..."
              : isLogin
                ? "Acessar Conta"
                : "Criar Conta"}
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-4 text-zinc-400 uppercase tracking-widest text-xs font-semibold">
              Ou
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={githubSignIn}
          className="w-full rounded-lg border border-zinc-300 bg-white py-3.5 text-sm font-semibold uppercase tracking-widest text-black transition-all hover:bg-zinc-50 flex items-center justify-center gap-3 cursor-pointer"
        >
          <svg
            viewBox="0 0 24 24"
            width="20"
            height="20"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
          </svg>
          Continuar com GitHub
        </button>

        <div className="mt-8 border-t border-zinc-100 pt-6 text-center">
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError(null);
            }}
            className="text-sm font-medium text-zinc-500 hover:text-black transition-colors cursor-pointer"
          >
            {isLogin
              ? "Não possui uma conta? Registre-se aqui"
              : "Já possui uma conta? Clique para entrar"}
          </button>
        </div>
      </div>
    </div>
  );
}
