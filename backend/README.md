# Documentação do Backend - Serviço de Upload de Arquivos

Este documento detalha a arquitetura, tecnologias e o fluxo de funcionamento do serviço de backend para upload de arquivos.

## Visão Geral

O projeto é um servidor de backend construído para lidar com uploads de arquivos. Ele utiliza uma arquitetura moderna, modular e de fácil manutenção, com uma clara separação de responsabilidades entre as diferentes camadas da aplicação (HTTP, Casos de Uso e Armazenamento).

## Tecnologias Utilizadas

- **Runtime:** [Bun](https://bun.sh/) - Um runtime JavaScript rápido e moderno, utilizado para rodar a aplicação.
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/) - Um superset do JavaScript que adiciona tipagem estática, aumentando a robustez e a manutenibilidade do código.
- **Framework Web:** [Fastify](https://www.fastify.io/) - Um framework web de alta performance para Node.js (e compatível com Bun), focado em velocidade e baixo overhead.
- **Validação de Dados:** [Zod](https://zod.dev/) - Uma biblioteca de declaração e validação de esquemas, usada para validar variáveis de ambiente e dados de entrada das requisições.
- **Armazenamento de Arquivos:** [Cloudflare R2](https://www.cloudflare.com/pt-br/developer-platform/r2/) - O serviço de armazenamento de objetos da Cloudflare, que possui uma API compatível com o S3 da AWS.
- **SDK de Armazenamento:** [AWS SDK for S3 (`@aws-sdk/client-s3`)](https://aws.amazon.com/sdk-for-javascript/) - Utilizado para se comunicar com a API do Cloudflare R2.

## Arquitetura do Projeto

A estrutura do projeto segue princípios de design de software que promovem a separação de conceitos (SoC) e a inversão de dependência (DI).

```
src/
├───env/          # Módulo de validação e carregamento de variáveis de ambiente
├───http/         # Camada de apresentação (HTTP)
│   ├───controller/ # Controladores que recebem requisições e chamam os casos de uso
│   └───routes/     # Definição das rotas da API
├───storage/      # Camada de abstração do armazenamento
│   ├───adapter/    # Implementações concretas para serviços de armazenamento (ex: R2)
│   ├───contracts/  # Interfaces (contratos) que definem como a camada de armazenamento deve funcionar
│   └───types/      # Tipos relacionados ao armazenamento
├───usecase/      # Camada de regras de negócio (Casos de Uso)
└───utils/        # Funções utilitárias reutilizáveis
```

### Camadas da Aplicação

1.  **`env`**: Responsável por carregar, validar e fornecer acesso seguro às variáveis de ambiente (como chaves de API, nome do bucket, etc.) usando Zod.
2.  **`http`**: A porta de entrada da aplicação.
    -   **`routes`**: Define os endpoints da API (ex: `POST /upload`). Utiliza o plugin `@fastify/multipart` para aceitar uploads de arquivos.
    -   **`controller`**: Recebe as requisições HTTP, extrai os dados relevantes (como o arquivo enviado) e invoca o caso de uso correspondente para executar a lógica de negócio.
3.  **`usecase`**: Onde a lógica de negócio principal reside. O `upload-image.usecase.ts` orquestra o processo de sanitização do nome do arquivo, validação e, finalmente, o upload. Ele não sabe *onde* o arquivo será salvo, apenas chama um método `save` de uma abstração.
4.  **`storage`**: A camada de persistência de dados.
    -   **`contracts/i-storage.ts`**: Define a interface `IStorage`, que estabelece um contrato com métodos como `save`. Isso permite que a implementação de armazenamento seja trocada facilmente sem alterar o resto do código.
    -   **`adapter/r2-storage-adapter.ts`**: A implementação concreta do contrato `IStorage`. É este arquivo que contém a lógica para se comunicar com o Cloudflare R2 usando o SDK da AWS.

## Fluxo de Upload de um Arquivo

1.  **Requisição:** Um cliente envia uma requisição `POST` com um arquivo (multipart/form-data) para o endpoint `/upload`.
2.  **Roteamento:** O Fastify, através das definições em `upload.routes.ts`, direciona a requisição para o `UploadImageController`.
3.  **Controlador:** O controlador extrai o arquivo da requisição.
4.  **Caso de Uso:** O controlador cria uma instância do `UploadImageUseCase`, injetando a dependência do `R2StorageAdapter`, e chama seu método `execute`.
5.  **Execução da Lógica:**
    -   O caso de uso sanitiza o nome do arquivo para remover caracteres especiais.
    -   Ele chama o método `save` do adaptador de armazenamento (`R2StorageAdapter`), passando os dados do arquivo.
6.  **Armazenamento:** O `R2StorageAdapter` utiliza o `@aws-sdk/client-s3` para fazer o upload do buffer do arquivo para o bucket configurado no Cloudflare R2.
7.  **Resposta:** Após o upload, o R2 retorna a URL do arquivo. Essa URL é repassada de volta pelas camadas até o controlador, que a envia como resposta HTTP para o cliente com um status `201 Created`.

## Como Executar o Projeto

1.  **Configurar Variáveis de Ambiente:**
    -   Copie o arquivo `.env.example` para um novo arquivo chamado `.env`.
    -   Preencha as variáveis de ambiente com suas credenciais do Cloudflare R2.

2.  **Instalar Dependências:**
    ```bash
    bun install
    ```

3.  **Executar em Modo de Desenvolvimento:**
    ```bash
    bun run dev
    ```

    O servidor iniciará em modo de desenvolvimento com hot-reload, monitorando alterações nos arquivos.
