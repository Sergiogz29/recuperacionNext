# --------------------------------------------------------
# Dockerfile.app
# --------------------------------------------------------

# ---------- Stage 1: Build de Next.js -------------------
FROM node:18-alpine AS builder

# Directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copiamos package.json y package-lock.json
COPY package*.json ./

# Instalamos dependencias
RUN npm install

# Copiamos el resto del código Fuente de Next.js
COPY . .

# Generamos la versión estática con output: "export"
RUN npm run build

# Por convención Next.js (con output: "export") crea la carpeta "out/" en /usr/src/app/out
# Confirmamos que existe out/index.html, etc.

# ---------- Stage 2: Servir con Nginx -------------------
FROM nginx:alpine

# Eliminamos el contenido por defecto de nginx/html
RUN rm -rf /usr/share/nginx/html/*

# Copiamos todo el contenido de la carpeta 'out/' al root de nginx
COPY --from=builder /usr/src/app/out /usr/share/nginx/html

# Exponemos el puerto 80
EXPOSE 80

# Inicio por defecto: nginx -g 'daemon off;'
CMD ["nginx", "-g", "daemon off;"]
