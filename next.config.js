/** @type {import('next').NextConfig} */
const nextConfig = {
  // Esto le dice a Next.js que, una vez hecho el "next build", genere todo el sitio
  // estático dentro de la carpeta `out/` al ejecutar `next export`.
  output: "export"
};

module.exports = nextConfig;
