# Sistema de Gerenciamento de Atividades (GitHub)

Painel de métricas e produtividade desenvolvido para extrair, filtrar e visualizar atividades de repositórios do GitHub (Commits, Pull Requests e Issues). Projeto desenvolvido na disciplina de **Projeto Integrador** do curso de Ciência da Computação da **UTFPR**.

---

## Demonstração Online (Deploy)

- **Frontend (Vercel):** https://projeto-integrador-gerenciamento-wine.vercel.app
- **Backend API (Render):** https://projeto-integrador-api-xq8c.onrender.com
- **Documentação Swagger (Produção):** https://projeto-integrador-api-xq8c.onrender.com/api
- **Health Check (Produção):** https://projeto-integrador-api-xq8c.onrender.com/health

---

## Funcionalidades Principais

- **Busca Dinâmica de Repositórios:** Extração em tempo real via GitHub REST API (`owner/repo`) com suporte a paginação automática.
- **Análise de Atividades:** Abas dedicadas para **Commits**, **Pull Requests** e **Issues**.
- **Filtros Avançados:** Recorte temporal por período (`since` e `until`), filtragem por autor, paginação e ordenação dinâmica nas tabelas.
- **Métricas Visuais:** Gráfico de produtividade (Recharts), mapa de calor de contribuições (_Heatmap_) e ranking de contribuidores.
- **Favoritos e Histórico:** Fixação de repositórios na barra lateral com sincronização em tempo real (Context API) e gravação de histórico de buscas no PostgreSQL.
- **Autenticação e Segurança:** Fluxo de login integrado ao **SuperTokens** (incluindo OAuth com GitHub) e filtro global de exceções (com tratamento amigável para erros 404 e _Rate Limit_ 429).
- **Interface Adaptável:** Design minimalista responsivo com suporte a _Dark Mode_, estados de _loading_ e notificações (_Toasts_).

---

## Arquitetura e Tecnologias

- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS, Recharts
- **Backend:** NestJS, TypeScript, TypeORM, Axios, Swagger, SuperTokens
- **Banco de Dados:** PostgreSQL (Docker local e PostgreSQL gerenciado no Render)
- **Qualidade & CI:** Jest (testes unitários no backend), GitHub Actions (validação automática de build e testes em PRs), Git Flow e Conventional Commits

### Estrutura de Pastas (Monorepo)

- **backend/** — API REST em NestJS (Porta 3000)
- **frontend/** — Interface Web em Next.js (Porta 3001)
- **.github/workflows/** — Pipeline de CI (GitHub Actions)
- **docker-compose.yml** — Orquestração do banco PostgreSQL local

---

## Como Executar Localmente

### Pré-requisitos

- Node.js (v24+ recomendado para os testes com ESM)
- Docker e Docker Compose
- Personal Access Token (PAT) do GitHub

### 1. Subir o Banco de Dados

Na raiz do projeto, execute:

    docker-compose up -d

### 2. Configurar e Iniciar o Backend (NestJS)

1. Acesse a pasta `backend`:

   cd backend

2. Crie o arquivo `.env` a partir do `.env.example` e preencha o seu `GITHUB_TOKEN`.
3. Instale as dependências e inicie o servidor:

   npm install
   npm run start:dev

4. Para executar os testes unitários:

   npm test

_Servidor disponível em `http://localhost:3000` (Health Check em `/health` e Swagger em `/api`)._

### 3. Configurar e Iniciar o Frontend (Next.js)

1. Em outro terminal, acesse a pasta `frontend`:

   cd frontend

2. Crie o arquivo `.env.local` a partir do `.env.example` e preencha `NEXT_PUBLIC_API_URL` e `NEXT_PUBLIC_GITHUB_TOKEN`.
3. Instale as dependências e inicie a aplicação:

   npm install
   npm run dev

_Painel disponível em `http://localhost:3001`._

---

## Equipe

- **Matheus Vinicius Faria Michels**
- **Thales Natan De Oliveira Nascimento**

## Licença

Este projeto está sob a licença MIT.
