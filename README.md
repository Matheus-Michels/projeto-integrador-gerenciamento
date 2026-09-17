# Projeto Integrador - Gerenciamento de Atividades

## Sobre o Projeto

Este é o backend do sistema de Gerenciamento de Atividades, desenvolvido como requisito do **Projeto Integrador**. A aplicação se conecta à API pública do GitHub para buscar e gerenciar dados de repositórios, commits e pull requests.

## Tecnologias Utilizadas

- **Backend:** NestJS
- **Banco de Dados:** PostgreSQL (rodando em Docker)
- **ORM:** TypeORM
- **Requisições HTTP:** Axios
- **Padronização:** Git Flow e Conventional Commits

## Como Executar Localmente

### Pré-requisitos

- Node.js instalado
- Docker e Docker Compose instalados

### Passos para rodar

1. Clone este repositório.
2. Na raiz do projeto, suba o banco de dados:
   ```bash
   docker-compose up -d
   ```
