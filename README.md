# Recuperación Next.js + Jenkins + Docker Compose

## Contenidos
- `Jenkinsfile`: Pipeline que clona, build, despliega en Nginx.
- `Dockerfile.jenkins`: Imagen personalizada de Jenkins (con Node.js, Git y plugins).
- `Dockerfile.app`: Imagen de Next.js + Nginx (servir carpeta estática `out/`).
- `docker-compose.yml`: Orquesta Jenkins y la app Next.js + Nginx.

### Pasos para desarrollo y prueba local (tu máquina)
1. Clonar:
   ```bash
   git clone https://github.com/Sergiogz29/recuperacionNext.git
   cd recuperacionNext
