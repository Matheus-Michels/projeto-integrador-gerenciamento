# Sistema de Gerenciamento de Atividades (GitHub)

Painel de métricas e produtividade desenvolvido para extrair, filtrar e visualizar atividades de repositórios do GitHub (Commits, Pull Requests e Issues). Projeto desenvolvido na disciplina de Projeto Integrador.

## Demonstração Online (Deploy)

- **Frontend (Vercel):** Em breve
- **Backend API (Render):** Em breve
- **Documentação Swagger:** http://localhost:3000/api (Local)

## Funcionalidades Principais

- **Busca Dinâmica de Repositórios:** Extração em tempo real de dados públicos via GitHub REST API (owner/repo).
- **Análise de Atividades:** Visualização em abas dedicadas para Commits, Pull Requests e Issues.
- **Filtros Avançados:** Recorte temporal por período (since e until) e filtragem por autor, com paginação e ordenação nas tabelas.
- **Métricas Visuais e Produtividade:** Gráficos de produtividade, ranking de colaboradores e visualização de atividades.
- **Sistema de Favoritos e Histórico:** Fixação de repositórios frequentes na barra lateral com sincronização em tempo real (Context API) e registro automático de buscas no PostgreSQL.
- **Autenticação e Segurança:** Integração com SuperTokens e tratamento global de exceções (incluindo proteção amigável contra Rate Limit da API do GitHub).
- **Interface Adaptável:** Design minimalista com suporte a Dark Mode.

## Arquitetura e Tecnologias

- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS, Recharts
- **Backend:** NestJS, TypeScript, TypeORM, Axios, Swagger, SuperTokens
- **Banco de Dados:** PostgreSQL (Containerizado via Docker)
- **Padronização:** Git Flow (main, develop, feat/_, fix/_, docs/\*) e Conventional Commits

### Estrutura de Pastas (Monorepo)

- **backend/** — API REST em NestJS (Porta 3000)
- **frontend/** — Interface Web em Next.js (Porta 3001)
- **docker-compose.yml** — Orquestração do banco PostgreSQL

## Como Executar Localmente

### Pré-requisitos

- Node.js (v18+)
- Docker e Docker Compose
- Personal Access Token (PAT) do GitHub

### 1. Subir o Banco de Dados

Na pasta raiz do projeto, execute no terminal:
docker-compose up -d

### 2. Configurar e Iniciar o Backend (NestJS)

1. Acesse a pasta backend:
   cd backend
2. Crie o arquivo .env copiando o modelo .env.example e adicione seu GITHUB_TOKEN.
3. Instale as dependências e inicie o servidor:
   npm install
   npm run start:dev
4. O servidor estará disponível em http://localhost:3000 (Health Check em /health e Swagger em /api).

### 3. Configurar e Iniciar o Frontend (Next.js)

1. Em outro terminal, acesse a pasta frontend:
   cd frontend
2. Crie o arquivo .env.local copiando o modelo .env.example e adicione seu NEXT_PUBLIC_GITHUB_TOKEN.
3. Instale as dependências e inicie a aplicação:
   npm install
   npm run dev
4. Acesse o painel em http://localhost:3001.

## Equipe

- **Matheus Vinicius Faria Michels**
- **Thales Natan De Oliveira Nascimento**

## Licença

Este projeto está sob a licença MIT.
