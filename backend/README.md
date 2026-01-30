# Backend - Serviço de Upload de Arquivos

Este documento detalha a arquitetura, as tecnologias e o fluxo de trabalho interno do serviço de backend. Para instruções sobre como executar o projeto usando Docker, por favor, veja o [`README.md` principal](../README.md).

## Visão Geral

O backend é um servidor de alta performance projetado para lidar com uploads de arquivos de forma eficiente. Ele é construído com uma arquitetura moderna e modular que enfatiza uma separação clara de responsabilidades entre as camadas da aplicação (HTTP, Casos de Uso e Armazenamento).

## Tecnologias Utilizadas

- **Runtime:** [Bun](https://bun.sh/) - Um runtime JavaScript rápido e completo, usado para executar a aplicação.
- **Framework Web:** [Fastify](https://www.fastify.io/) - Um framework web de alta performance para Node.js (e Bun), conhecido por sua velocidade e baixo overhead.
- **Linguagem:** [TypeScript](https://www.typescript.org/) - Um superset do JavaScript que adiciona tipagem estática, melhorando a qualidade e a manutenibilidade do código.
- **Validação de Dados:** [Zod](https://zod.dev/) - Uma biblioteca de declaração e validação de esquemas focada em TypeScript, usada para validar variáveis de ambiente e entradas de requisições.
- **Armazenamento de Arquivos:** [Cloudflare R2](https://www.cloudflare.com/products/r2/) - O serviço de armazenamento de objetos da Cloudflare, que fornece uma API compatível com o S3.
- **SDK de Armazenamento:** [AWS SDK for S3 (`@aws-sdk/client-s3`)](https://aws.amazon.com/sdk-for-javascript/) - Usado para se comunicar com a API do Cloudflare R2.

## Arquitetura

A estrutura do projeto segue princípios de design de software como Separação de Responsabilidades (SoC) e Inversão de Dependência (DI), promovendo um código base modular e testável.

```
src/
├───env/          # Módulo para carregar e validar variáveis de ambiente
├───http/         # Camada de Apresentação (HTTP)
│   ├───controller/ # Controladores que lidam com requisições e invocam casos de uso
│   └───routes/     # Definições de rotas da API
├───storage/      # Camada de Abstração de Armazenamento
│   ├───adapter/    # Implementações concretas para serviços de armazenamento (ex: R2)
│   ├───contracts/  # Interfaces (contratos) que definem o comportamento do armazenamento
│   └───types/      # Tipos relacionados ao armazenamento
├───usecase/      # Camada de Lógica de Negócio (Casos de Uso)
└───utils/        # Funções utilitárias reutilizáveis
```

### Camadas da Aplicação

1.  **`env`**: Responsável por carregar, validar (com Zod) e fornecer acesso seguro a variáveis de ambiente como chaves de API e nomes de bucket.
2.  **`http`**: O ponto de entrada da aplicação.
    -   **`routes`**: Define os endpoints da API (ex: `POST /upload`) e usa `@fastify/multipart` para lidar com uploads de arquivos.
    -   **`controller`**: Recebe as requisições HTTP, extrai os dados relevantes (como o arquivo enviado) e chama o caso de uso apropriado para executar a lógica de negócio.
3.  **`usecase`**: Contém a lógica de negócio principal. O `upload-image.usecase.ts` orquestra o processo de sanitização do nome do arquivo, validação da entrada e acionamento do upload. Ele depende da interface `IStorage`, não de uma implementação concreta.
4.  **`storage`**: A camada de persistência de dados.
    -   **`contracts/i-storage.ts`**: Define a interface `IStorage`, que estabelece um contrato com métodos como `save`. Isso permite que a implementação do armazenamento seja facilmente trocada sem afetar o resto da aplicação.
    -   **`adapter/r2-storage-adapter.ts`**: A implementação concreta de `IStorage`. Este arquivo contém a lógica para se comunicar com o Cloudflare R2 usando o SDK da AWS.

## Fluxo de Upload de Arquivo

1.  **Requisição:** Um cliente envia uma requisição `POST` com um arquivo (multipart/form-data) para o endpoint `/upload`.
2.  **Roteamento:** O Fastify, através das definições em `upload.routes.ts`, direciona a requisição para o `UploadImageController`.
3.  **Controlador:** O controlador extrai o arquivo da requisição.
4.  **Caso de Uso:** O controlador instancia o `UploadImageUseCase`, injetando a dependência do `R2StorageAdapter`, e chama seu método `execute`.
5.  **Execução da Lógica:**
    -   O caso de uso sanitiza o nome do arquivo para remover caracteres especiais.
    -   Ele chama o método `save` no adaptador de armazenamento (`R2StorageAdapter`), passando os dados do arquivo.
6.  **Armazenamento:** O `R2StorageAdapter` usa o `@aws-sdk/client-s3` para fazer o upload do buffer do arquivo para o bucket configurado no Cloudflare R2.
7.  **Resposta:** Após um upload bem-sucedido, o R2 retorna a URL do arquivo. Essa URL é passada de volta através das camadas até o controlador, que a envia na resposta HTTP para o cliente com um status `201 Created`.

## Desenvolvimento Local

As instruções a seguir são para executar o serviço de backend localmente.

1.  **Configure as Variáveis de Ambiente:**
    -   Copie o arquivo `.env.example` para um novo arquivo chamado `.env`.
    -   Preencha as variáveis de ambiente com suas credenciais do Cloudflare R2.

2.  **Instale as Dependências:**
    ```bash
    bun install
    ```

3.  **Execute em Modo de Desenvolvimento:**
    ```bash
    bun run dev
    ```

    O servidor será iniciado em modo de desenvolvimento com hot-reloading, reiniciando automaticamente em caso de alterações nos arquivos.
