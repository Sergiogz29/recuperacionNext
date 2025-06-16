// pages/index.js
import Link from "next/link";
import React from "react";

export default function Home({ posts }) {
  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "2rem" }}>
      <h1>Listado de Posts de Sergio Garcia Zamora</h1>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {posts.map((post) => (
          <li key={post.id} style={{ margin: "0.5rem 0" }}>
            <Link href={`/posts/${post.id}`}>
              <a style={{ textDecoration: "none", color: "#0070f3" }}>
                {post.title}
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Esta función se ejecuta en build time, Next.js genera en "out/" un index.html estático con la lista de posts.
export async function getStaticProps() {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts");
  const posts = await res.json();

  return {
    props: {
      posts: posts.slice(0, 100) // opcional: limitar a 100, o quita el slice para traerlos todos.
    }
  };
}
