#!/bin/bash

# Instalar todas as dependências, incluindo as de desenvolvimento
npm install --include=dev

# Gerar o Prisma Client
npx prisma generate

# Executar o build do Next.js
npm run build 