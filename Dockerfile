# Etapa 1: build del frontend (Astro -> archivos estáticos)
FROM node:22-bullseye-slim AS frontend-builder

WORKDIR /app/frontend

COPY frontend/package.json frontend/package-lock.json* ./
RUN npm install

COPY frontend/ ./
# outDir de astro.config.mjs es ../web, relativo a /app/frontend
RUN npm run build

# Etapa 2: Builder de Go
FROM golang:1.24-bullseye AS builder

# Directorio de trabajo
WORKDIR /app

# Instalar librerías necesarias para CGO (SQLite)
RUN apt-get update && \
    apt-get install -y build-essential libsqlite3-dev git && \
    rm -rf /var/lib/apt/lists/*

# Copiar módulos y descargar dependencias
COPY go.mod go.sum ./
RUN go mod download

# Copiar todo el proyecto
COPY . .

# Frontend ya buildeado en la etapa anterior
COPY --from=frontend-builder /app/web ./web

# Compilar binario y dejar scripts/ y web/ como hermanos
RUN mkdir -p bin && \
    go build -o bin/app ./cmd/bitacora && \
    cp -r ./scripts bin/ && \
    cp -r ./web bin/

# Etapa 3: Imagen final mínima
FROM debian:11-slim

# Instalar librerías de runtime necesarias para CGO
RUN apt-get update && \
    apt-get install -y libsqlite3-0 ca-certificates && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copiar binario junto con scripts/ y web/ (paths relativos al cwd)
COPY --from=builder /app/bin/ ./

# Definir comando por defecto
CMD ["./app"]
