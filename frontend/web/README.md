# Frontend - Serviço de Upload de Arquivos

Este é o frontend para o Serviço de Upload de Arquivos, construído com React, Vite e Tailwind CSS. Para instruções sobre como executar o projeto inteiro com Docker, por favor, veja o [`README.md` principal](../../README.md).

## Table of Contents

- [Funcionalidades](#-funcionalidades)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Desenvolvimento Local](#-desenvolvimento-local)

## ✨ Funcionalidades

- **Arrastar e Soltar:** Arraste e solte arquivos facilmente na área de upload.
- **Progresso em Tempo Real:** Feedback visual para o progresso de upload individual e geral.
- **Compressão de Imagem:** Escolha o nível de compressão (baixa, média, alta) - a compressão é feita no backend.
- **Uploads Concorrentes:** Lida com múltiplos uploads de arquivos ao mesmo tempo.
- **Gerenciamento de Upload:** Cancele, tente novamente e copie links para seus uploads.
- **Design Responsivo:** Uma interface limpa que funciona tanto em desktops quanto em dispositivos móveis.

## 🛠️ Tecnologias Utilizadas

- **Framework:** [React](https://react.dev/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
- **Estilização:** [Tailwind CSS](https://tailwindcss.com/)
- **Gerenciamento de Estado:** [Zustand](https://zustand-demo.pmnd.rs/) para um gerenciamento de estado global simples e eficaz.
- **Componentes de UI:** [Radix UI](https://www.radix-ui.com/) para componentes acessíveis e não estilizados.
- **Ícones:** [Lucide React](https://lucide.dev/guide/packages/lucide-react)
- **Animações:** [Motion](https://motion.dev/) (anteriormente Framer Motion)

## 🚀 Desenvolvimento Local

As instruções a seguir são para executar o serviço de frontend localmente.

1. **Navegue até o diretório web:**
   ```bash
   cd frontend/web
   ```

2. **Instale as Dependências:**
   ```bash
   bun install
   ```

3. **Execute em Modo de Desenvolvimento:**
   ```bash
   bun dev
   ```

   O servidor de desenvolvimento será iniciado em [http://localhost:5173](http://localhost:5173).

   **Nota:** Para a funcionalidade de upload funcionar, o serviço de backend também precisa estar em execução em `http://localhost:3000`. O Vite está configurado para redirecionar automaticamente as requisições `/api` para o backend.
