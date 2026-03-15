# Backend - Serviço de Upload de Arquivos

Este documento detalha a arquitetura, as tecnologias e o fluxo de trabalho interno do serviço de backend. Para instruções sobre como executar o projeto usando Docker, por favor, veja o [`README.md` principal](../README.md).

## Table of Contents

- [Visão Geral](#visão-geral)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Arquitetura](#arquitetura)
  - [Camadas da Aplicação](#camadas-da-aplicação)
- [Fluxo de Upload de Arquivo](#fluxo-de-upload-de-arquivo)
- [Desenvolvimento Local](#desenvolvimento-local)

## Visão Geral

O backend é um servidor de alta performance projetado para lidar com uploads de arquivos de forma eficiente. Ele é construído com uma arquitetura moderna e modular que enfatiza uma separação clara de responsabilidades entre as camadas da aplicação (HTTP, Casos de Uso e Infraestrutura).

## Tecnologias Utilizadas

- **Runtime:** [Bun](https://bun.sh/) - Um runtime JavaScript rápido e completo.
- **Framework Web:** [Fastify](https://www.fastify.io/) - Um framework web de alta performance.
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/) - Superset do JavaScript com tipagem estática.
- **Validação de Dados:** [Zod](https://zod.dev/) - Biblioteca para declaração e validação de esquemas.
- **Armazenamento de Arquivos:** [Cloudflare R2](https://www.cloudflare.com/products/r2/) - Serviço de armazenamento de objetos compatível com S3.
- **SDK de Armazenamento:** [AWS SDK for S3](https://aws.amazon.com/sdk-for-javascript/) - Para comunicação com Cloudflare R2.
- **Compressão de Imagem:** [Sharp](https://sharp.pixelplumbing.com/) - Biblioteca de processamento de imagens de alta performance.

## Arquitetura

A estrutura do projeto segue princípios de design de software como Separação de Responsabilidades (SoC) e Inversão de Dependência (DI), promovendo um código base modular e testável.

```
src/
├── env/            # Módulo para carregar e validar variáveis de ambiente
├── errors/        # Tratamento de erros
├── factories/     # Fábricas para criação de dependências
├── health/        # Verificação de saúde da aplicação
├── http/          # Camada de Apresentação (HTTP)
│   ├── controller/  # Controladores que lidam com requisições
│   └── routes/     # Definições de rotas da API
├── infra/         # Camada de Infraestrutura
│   ├── image/       # Processamento de imagens
│   │   ├── contracts/  # Interfaces para compressão de imagens
│   │   └── sharp-compressor.ts  # Implementação usando Sharp
│   └── r2/         # Armazenamento Cloudflare R2
│       ├── contracts/  # Interfaces de armazenamento
│       ├── types/    # Tipos relacionados ao armazenamento
│       └── r2-storage-adapter.ts  # Implementação do adapter R2
├── usecase/      # Camada de Lógica de Negócio (Casos de Uso)
└── utils/        # Funções utilitárias reutilizáveis
```

### Camadas da Aplicação

1. **`env`**: Responsável por carregar, validar (com Zod) e fornecer acesso seguro a variáveis de ambiente.
2. **`http`**: O ponto de entrada da aplicação.
   - **`routes`**: Define os endpoints da API e usa `@fastify/multipart` para uploads.
   - **`controller`**: Recebe requisições HTTP e chama o caso de uso apropriado.
3. **`usecase`**: Contém a lógica de negócio principal. O `UploadImageUseCase` orquestra o processo de sanitização, validação e upload. Ele depende de interfaces, não de implementações concretas.
4. **`infra`**: A camada de infraestrutura.
   - **`r2/r2-storage-adapter.ts`**: Implementação de armazenamento usando Cloudflare R2.
   - **`image/sharp-compressor.ts`**: Implementação de compressão de imagens usando Sharp.

## Fluxo de Upload de Arquivo

1. **Requisição:** Um cliente envia uma requisição `POST` com um arquivo (multipart/form-data) para o endpoint `/uploads`.
2. **Roteamento:** O Fastify direciona a requisição para o `UploadImageController`.
3. **Controlador:** O controlador extrai o arquivo e o nível de compressão da requisição.
4. **Caso de Uso:** O controlador instancia o `UploadImageUseCase`, injetando as dependências (R2StorageAdapter e ImageCompressor), e chama seu método `execute`.
5. **Compressão:** A imagem é comprimida usando Sharp com o nível de compressão especificado (low, medium, high).
6. **Armazenamento:** O arquivo comprimido é enviado para o Cloudflare R2.
7. **Resposta:** O backend retorna a URL pública do arquivo comprimido com informações sobre economia de espaço.

## Desenvolvimento Local

As instruções a seguir são para executar o serviço de backend localmente.

1. **Configure as Variáveis de Ambiente:**
   - Copie o arquivo `.env.example` para um novo arquivo chamado `.env`.
   - Preencha as variáveis de ambiente com suas credenciais do Cloudflare R2.

2. **Instale as Dependências:**
   ```bash
   bun install
   ```

3. **Execute em Modo de Desenvolvimento:**
   ```bash
   bun run dev
   ```

   O servidor será iniciado em modo de desenvolvimento com hot-reloading em `http://localhost:3000`.
