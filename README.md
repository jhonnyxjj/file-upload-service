# Serviço de Upload de Arquivos

Este projeto é um serviço de upload de arquivos com um frontend e um backend.

## Executando com Docker

Para executar a aplicação com Docker, você precisa criar um arquivo `.env` no diretório `backend` com as seguintes variáveis de ambiente:

```
# R2 Storage
R2_ACCESS_KEY_ID=<SUA_CHAVE_DE_ACESSO_R2>
R2_SECRET_ACCESS_KEY=<SUA_CHAVE_SECRETA_DE_ACESSO_R2>
R2_BUCKET_NAME=<NOME_DO_SEU_BUCKET_R2>
R2_ACCOUNT_ID=<ID_DA_SUA_CONTA_R2>
R2_PUBLIC_URL=<URL_PUBLICA_DO_SEU_R2>

# Server
SERVER_PORT=3000
```

Depois de criar o arquivo `.env`, você pode executar a aplicação com o seguinte comando:

```bash
docker-compose up -d
```