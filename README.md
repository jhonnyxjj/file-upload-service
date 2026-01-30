# Serviço de Upload de Arquivos

Este projeto é um serviço completo de upload de arquivos, com um frontend moderno construído com React e um backend robusto utilizando Bun e Fastify. Toda a aplicação é containerizada com Docker para facilitar a configuração e o deploy.

## ✨ Funcionalidades

- **Upload com Arrastar e Soltar:** Uma interface amigável para o upload de arquivos.
- **Progresso em Tempo Real:** Acompanhe o progresso do upload de cada arquivo individualmente e também o progresso geral.
- **Compressão de Imagem:** Escolha entre diferentes níveis de compressão (baixa, média, alta) antes de fazer o upload.
- **Uploads Concorrentes:** Envie múltiplos arquivos simultaneamente.
- **Cancelar e Tentar Novamente:** Cancele uploads em andamento ou tente novamente aqueles que falharam.
- **Copiar para a Área de Transferência:** Copie facilmente a URL de um arquivo que já foi enviado.

## 🖼️ Interface do Usuário

O frontend oferece uma interface limpa e intuitiva para gerenciar os uploads de arquivos. Os usuários podem arrastar e soltar arquivos, ver uma lista de todos os uploads com seu progresso e interagir com cada um individualmente.

**[Espaço para a Screenshot da UI]**

*TODO: Adicione uma screenshot da interface do usuário da aplicação aqui.*

## 🚀 Começando

A maneira recomendada de executar este projeto é usando Docker.

### Pré-requisitos

- [Docker](https://docs.docker.com/get-docker/) instalado na sua máquina.
- [Docker Compose](https://docs.docker.com/compose/install/) instalado na sua máquina.

### Executando com Docker

1.  **Clone o repositório:**
    ```bash
    git clone <url-do-repositorio>
    cd file-upload-service
    ```

2.  **Configure as Variáveis de Ambiente:**
    Navegue até o diretório `backend` e crie um arquivo `.env` copiando o exemplo:
    ```bash
    cd backend
    cp .env.example .env
    ```
    Agora, abra o arquivo `.env` e preencha com suas credenciais do Cloudflare R2.

3.  **Construa e Execute os Containers:**
    Volte para o diretório raiz e inicie a aplicação usando o Docker Compose:
    ```bash
    cd ..
    docker-compose up --build -d
    ```

4.  **Acesse a Aplicação:**
    -   O **frontend** estará disponível em [http://localhost:8080](http://localhost:8080).
    -   A API do **backend** estará rodando na porta `3000`.

## 🛠️ Tecnologias Utilizadas

### Backend

- **Runtime:** [Bun](https://bun.sh/)
- **Framework:** [Fastify](https://www.fastify.io/)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
- **Armazenamento:** [Cloudflare R2](https://www.cloudflare.com/products/r2/)
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

