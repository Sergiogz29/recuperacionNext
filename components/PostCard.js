// components/PostCard.js
// Componente que muestra una "tarjeta" de información de un Post

import Link from 'next/link';

export default function PostCard({ post }) {
  return (
    <div className="card">
      {/* Título del post */}
      <h3>{post.title}</h3>

      {/* Extracto del cuerpo del post */}
      <p>{post.body.slice(0, 100)}...</p>

      {/* Enlace a la página de detalle del post (sin <a> interno) */}
      <Link href={`/posts/${post.id}`}>
        Leer más
      </Link>

      <style jsx>{`
        .card {
          border: 1px solid #ccc;
          padding: 1rem;
          margin: 1rem;
          border-radius: 8px;
          transition: box-shadow 0.3s;
        }
        .card:hover {
          box-shadow: 0 0 11px rgba(33, 33, 33, 0.2);
        }
        h3 {
          margin: 0;
        }
      `}</style>
    </div>
  );
}
