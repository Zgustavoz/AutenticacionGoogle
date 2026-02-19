# Etapa 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

# Copiar dependencias
COPY package*.json ./
RUN npm ci

# Copiar código
COPY . .

# Declarar ARGs y convertir a ENV para que Vite los lea
ARG VITE_API_URL
ARG VITE_GOOGLE_CLIENT_ID
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID

# Construir
RUN npm run build

# Etapa 2: Servir con Nginx
FROM nginx:alpine

# Copiar archivos estáticos
COPY --from=builder /app/dist /usr/share/nginx/html

# Configuración de Nginx para SPA
RUN echo 'server { \
    listen 80; \
    server_name _; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]