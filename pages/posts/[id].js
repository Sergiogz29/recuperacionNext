// pages/posts/[id].js
import React from "react";
import Link from "next/link";

export default function PostPage({ post }) {
  if (!post) {
    return <p>Cargando...</p>;
  }

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "2rem" }}>
      <Link href="/">
        <a style={{ color: "#0070f3", textDecoration: "none" }}>← Volver</a>
      </Link>
      <h1 style={{ marginTop: "1rem" }}>{post.title}</h1>
      <p>{post.body}</p>
    </div>
  );
}

// Genera de forma estática (en build time) todas las rutas /posts/<id>
export async function getStaticPaths() {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts");
  const posts = await res.json();

  const paths = posts.map((p) => ({
    params: { id: p.id.toString() }
  }));

  return {
    paths,
    fallback: false // falso = si existe un id no en paths, Next muestra 404
  };
}

// Para cada ruta /posts/<id>, fetch del post exacto en build time
export async function getStaticProps({ params }) {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${params.id}`
  );
  const post = await res.json();

  return {
    props: {
      post
    }
  };
}
