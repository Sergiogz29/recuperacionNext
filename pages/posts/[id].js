// pages/posts/[id].js

import Link from 'next/link';

export default function PostDetail({ post, user, comments }) {
  return (
    <div className="container">
      {/* Enlace para volver a la página principal */}
      <Link href="/">← Volver</Link>

      <h1>{post.title}</h1>
      <p>{post.body}</p>

      <section>
        <h2>Autor</h2>
        <p>
          <strong>{user.name}</strong>
        </p>
        <p>Email: {user.email}</p>
      </section>

      <section>
        <h2>Comentarios</h2>
        {comments.map((comment) => (
          <div key={comment.id} className="comment">
            <p>
              <strong>{comment.name}</strong> ({comment.email})
            </p>
            <p>{comment.body}</p>
          </div>
        ))}
      </section>

      <style jsx>{`
        .container {
          padding: 2rem;
        }
        section {
          margin-top: 2rem;
        }
        .comment {
          border: 1px solid #ddd;
          padding: 1rem;
          margin-bottom: 1rem;
          border-radius: 5px;
        }
      `}</style>
    </div>
  );
}

// 1) getStaticPaths: genera un array de paths con cada ID de post
export async function getStaticPaths() {
  // Recupera la lista de posts (100 posts de jsonplaceholder)
  const res = await fetch('https://jsonplaceholder.typicode.com/posts');
  const posts = await res.json();

  // Genera un array de objetos { params: { id: '1' }, params: { id: '2' }, ... }
  const paths = posts.map((post) => ({
    params: { id: post.id.toString() },
  }));

  return {
    paths,
    // fallback: false => cualquier ruta distinta a las generadas dará 404
    fallback: false,
  };
}

// 2) getStaticProps: para cada id,  
//    genera en build las props necesarias: post, user y comments
export async function getStaticProps({ params }) {
  const { id } = params;

  // Obtiene los datos del post
  const resPost = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${id}`
  );
  const post = await resPost.json();

  // Obtiene los datos del usuario (autor)
  const resUser = await fetch(
    `https://jsonplaceholder.typicode.com/users/${post.userId}`
  );
  const user = await resUser.json();

  // Obtiene los comentarios del post
  const resComments = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${id}/comments`
  );
  const comments = await resComments.json();

  return {
    props: {
      post,
      user,
      comments,
    },
  };
}
