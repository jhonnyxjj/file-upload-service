# Serviço de Upload de Arquivos

Este projeto é um serviço completo de upload de arquivos, com um frontend moderno construído com React e um backend robusto utilizando Bun e Fastify. Toda a aplicação é containerizada com Docker para facilitar a configuração e o deploy.

## Table of Contents

- [Funcionalidades](#-funcionalidades)
- [Interface do Usuário](#-interface-do-usuário)
- [Começando](#-começando)
  - [Pré-requisitos](#pré-requisitos)
  - [Executando com Docker](#executando-com-docker)
  - [Executando Localmente (sem Docker)](#executando-localmente-sem-docker)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Estrutura do Projeto](#-estrutura-do-projeto)

## ✨ Funcionalidades

- **Upload com Arrastar e Soltar:** Uma interface amigável para o upload de arquivos.
- **Progresso em Tempo Real:** Acompanhe o progresso do upload de cada arquivo individualmente e também o progresso geral.
- **Compressão de Imagem:** Escolha entre diferentes níveis de compressão (baixa, média, alta) no backend.
- **Uploads Concorrentes:** Envie múltiplos arquivos simultaneamente.
- **Cancelar e Tentar Novamente:** Cancele uploads em andamento ou tente novamente aqueles que falharam.
- **Copiar para a Área de Transferência:** Copie facilmente a URL de um arquivo que já foi enviado.

## 🖼️ Interface do Usuário

O frontend oferece uma interface limpa e intuitiva para gerenciar os uploads de arquivos. Os usuários podem arrastar e soltar arquivos, ver uma lista de todos os uploads com seu progresso e interagir com cada um individualmente.

**🎥 Upload Flow Demo**

https://github.com/user-attachments/assets/a7654cc5-c117-4902-aa94-43f55a3e849a

## 🚀 Começando

### Pré-requisitos

- **Para Docker:** [Docker](https://docs.docker.com/get-docker/) e [Docker Compose](https://docs.docker.com/compose/install/) instalados.
- **Para desenvolvimento local:** [Bun](https://bun.sh/) instalado.

### Executando com Docker

1. **Clone o repositório:**
   ```bash
   git clone <url-do-repositorio>
   cd file-upload-service
   ```

2. **Configure as Variáveis de Ambiente:**
   Navegue até o diretório `backend` e crie um arquivo `.env` copiando o exemplo:
   ```bash
   cd backend
   cp .env.example .env
   ```
   Agora, abra o arquivo `.env` e preencha com suas credenciais do Cloudflare R2.

3. **Construa e Execute os Containers:**
   Volte para o diretório raiz e inicie a aplicação usando o Docker Compose:
   ```bash
   cd ..
   docker-compose up --build -d
   ```

4. **Acesse a Aplicação:**
   - O **frontend** estará disponível em [http://localhost](http://localhost).
   - A API do **backend** estará rodando na porta `3000`.

### Executando Localmente (sem Docker)

#### Backend

```bash
cd backend
bun install
bun run dev
```

O backend estará disponível em `http://localhost:3000`.

#### Frontend

```bash
cd frontend/web
bun install
bun dev
```

O frontend estará disponível em `http://localhost:5173`.

**Nota:** Para o frontend funcionar corretamente, o backend deve estar rodando. O Vite proxy configurará as requisições `/api` para `http://localhost:3000`.

## 🛠️ Tecnologias Utilizadas

### Backend

- **Runtime:** [Bun](https://bun.sh/)
- **Framework:** [Fastify](https://www.fastify.io/)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
- **Armazenamento:** [Cloudflare R2](https://www.cloudflare.com/products/r2/)
- **Compressão de Imagem:** [Sharp](https://sharp.pixelplumbing.com/)
- **Validação:** [Zod](https://zod.dev/)

### Frontend

- **Framework:** [React](https://react.dev/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
- **Estilização:** [Tailwind CSS](https://tailwindcss.com/)
- **Gerenciamento de Estado:** [Zustand](https://zustand-demo.pmnd.rs/)
- **Componentes de UI:** [Radix UI](https://www.radix-ui.com/)

## 📁 Estrutura do Projeto

O repositório é organizado em duas partes principais: `frontend` e `backend`.

```
.
├── backend/        # Serviço de backend (Bun + Fastify)
├── frontend/       # Aplicação frontend (React + Vite)
├── docker-compose.yml # Configuração do Docker Compose
└── README.md       # Este arquivo
```

Para informações mais detalhadas sobre cada parte, por favor, consulte os arquivos `README.md` dentro dos diretórios `backend` e `frontend/web`.
