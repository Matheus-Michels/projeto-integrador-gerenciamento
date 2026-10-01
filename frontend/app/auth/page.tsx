'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { initSuperTokens } from '../../config/supertokens';
import { signIn, signUp } from 'supertokens-web-js/recipe/emailpassword';

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    initSuperTokens();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        const response = await signIn({
          formFields: [
            { id: 'email', value: email },
            { id: 'password', value: password },
          ],
        });

        if (response.status === 'FIELD_ERROR') {
          setError(response.formFields[0]?.error || 'Erro no preenchimento dos campos.');
        } else if (response.status === 'WRONG_CREDENTIALS_ERROR') {
          setError('Email ou senha incorretos.');
        } else if (response.status === 'OK') {
          router.push('/');
        }
      } else {
        const response = await signUp({
          formFields: [
            { id: 'email', value: email },
            { id: 'password', value: password },
          ],
        });

        if (response.status === 'FIELD_ERROR') {
          setError(response.formFields[0]?.error || 'Dados inválidos para registro.');
        } else if (response.status === 'OK') {
          router.push('/');
        }
      }
    } catch (err: any) {
      setError(err?.message || 'Falha ao conectar com o serviço de autenticação.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-8">
      <div className="bg-white p-10 border border-zinc-200 shadow-sm rounded-xl">
        <h1 className="text-3xl font-black mb-2 uppercase tracking-tighter text-black">
          {isLogin ? 'Entrar' : 'Cadastrar'}
        </h1>
        <p className="text-zinc-500 mb-8 text-base font-light leading-relaxed">
          {isLogin
            ? 'Insira suas credenciais para acessar o painel de atividades.'
            : 'Preencha os campos abaixo para criar seu acesso ao sistema.'}
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
            {loading ? 'Processando...' : isLogin ? 'Acessar Conta' : 'Criar Conta'}
          </button>
        </form>

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
              ? 'Não possui uma conta? Registre-se aqui'
              : 'Já possui uma conta? Clique para entrar'}
          </button>
        </div>
      </div>
    </div>
  );
}