#!/bin/bash

# Instalar todas as dependências
npm install

# Gerar o Prisma Client
npx prisma generate

# Executar o build do Next.js
npm run build 