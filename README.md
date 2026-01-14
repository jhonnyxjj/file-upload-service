# File Upload Service

This project is a file upload service with a frontend and a backend.

## Running with Docker

To run the application with Docker, you need to create a `.env` file in the `backend` directory with the following environment variables:

```
# R2 Storage
R2_ACCESS_KEY_ID=<YOUR_R2_ACCESS_KEY_ID>
R2_SECRET_ACCESS_KEY=<YOUR_R2_SECRET_ACCESS_KEY>
R2_BUCKET_NAME=<YOUR_R2_BUCKET_NAME>
R2_ACCOUNT_ID=<YOUR_R2_ACCOUNT_ID>
R2_PUBLIC_URL=<YOUR_R2_PUBLIC_URL>

# Server
SERVER_PORT=3000
```

After creating the `.env` file, you can run the application with the following command:

```bash
docker-compose up -d
```
